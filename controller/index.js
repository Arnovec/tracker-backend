const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Users } = require('../db/sequelize');

function checkValidation(req) {
    const validationRes = validationResult(req);
    if (!validationRes.isEmpty()) {

        throw new Error();
    }
}

async function checkUserWithHash(user) {
    let findUser = await Users.findOne({
        where: {
            id: user.id,
            login: user.login,
        }
    });

    if (!findUser)
        throw new Error();
    return findUser.toJSON();
}

async function verifyAccessToken(token) {
    if (!token) throw new Error();
    console.log("пришедший токен", token)
    const user = jwt.verify(token, "access_key");
    await checkUserWithHash(user);

    return user;
}

async function verifyRefreshToken(token) {
    if (!token) throw new Error();

    const user = jwt.verify(token, "refresh_key");
    await checkUserWithHash(user);

    return user;
}

async function checkAccessToken(req, res, next) {
    try {
        console.log("rerererer");
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(" ")[1];

        req.user = await verifyAccessToken(token);
        return next();
    } catch (err) {
        console.log(err)
        console.log("токен исек(((((")
    }
    return res.sendStatus(403);
}

module.exports = {
    checkValidation,
    checkUserWithHash,
    verifyAccessToken,
    verifyRefreshToken,
    checkAccessToken
}