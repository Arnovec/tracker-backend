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
            password: user.password
        }
    });

    if (!findUser)
        throw new Error();
    return findUser.toJSON();
}

async function checkAccessToken(token) {
    if (!token) throw new Error();

    const user = jwt.verify(token, "access_key");
    await checkUserWithHash(user);

    return user;
}

async function checkRefreshToken(token) {
    if (!token) throw new Error();

    const user = jwt.verify(token, "refresh_key");
    await checkUserWithHash(user);

    return user;
}

module.exports = {
    checkValidation,
    checkUserWithHash,
    checkAccessToken,
    checkRefreshToken
}