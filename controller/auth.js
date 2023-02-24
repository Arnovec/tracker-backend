const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Users } = require('../db/sequelize');
const { validationResult } = require('express-validator');

function checkValidation(req) {
    const validationRes = validationResult(req);
    if (!validationRes.isEmpty()) {

        throw new Error();
    }
}

async function checkUser(login, password) {
    let user = await Users.findOne({
        where: {
            login: login,
        }
    });
    if (!user)
        throw new Error();
    user = user.toJSON();
    if (!await bcrypt.compare(password, user.password))
        throw new Error();
    return user;
}

async function checkUserWithHash(user) {
    let findUser = await Users.findOne({
        where: {
            id: user.id,
            login: user.login,
            password: user.password
        }
    });

    if (!findUser)
        throw new Error();
    return findUser.toJSON();
}

async function checkAcessToken(token) {
    if (!token) throw new Error();

    const user = jwt.verify(token, "acess_key");
    await checkUserWithHash(user);

    return user;
}

async function checkRefreshToken(token) {
    if (!token) throw new Error();

    const user = jwt.verify(token, "refresh_key");
    await checkUserWithHash(user);

    return user;
}

function generateAccesToken(user) {
    return jwt.sign(
        { id: user.id, login: user.login, password: user.password },
        "acess_key",
        { expiresIn: "10m" }
    )
}

function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.id, login: user.login, password: user.password },
        "refresh_key"
    );
}

function result(user) {
    return {
        acessToken: generateAccesToken(user),
        refreshTokens: generateRefreshToken(user),
        id: user.id,
    }
}

class authController {

    async register(req, res) {
        try {
            checkValidation(req);
            const { name, login, surname, password } = req.body;
            const hashPas = await bcrypt.hash(password, 10);
            const newUser = (await Users.create({
                login: login,
                name: name,
                surname: surname,
                password: hashPas,
            })).toJSON();

            return res.json(result(newUser));
        } catch (error) {
            console.log(error);
        }
        return res.sendStatus(401);
    }

    async login(req, res) {
        try {
            checkValidation(req);
            const { login, password } = req.body;
            const user = await checkUser(login, password);

            return res.json(result(user));
        } catch (error) {
            console.log(error);
        }
        return res.sendStatus(401);
    }

    async refresh(req, res) {
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader.split(" ")[1];
            const user = await checkRefreshToken(token);

            return res.json(result(user));
        } catch (error) {
            console.log(error);
        }
        return res.sendStatus(401);
    }

}

module.exports = new authController();