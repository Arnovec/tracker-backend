const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Users } = require('../db/sequelize');
const {
    checkRefreshToken,
    checkValidation
} = require('./index');

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



function generateAccesToken(user) {
    return jwt.sign(
        { id: user.id, login: user.login, password: user.password },
        "access_key",
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
        accessToken: generateAccesToken(user),
        refreshToken: generateRefreshToken(user),
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
            console.log("1")
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