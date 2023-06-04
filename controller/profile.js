const { Sequelize } = require('sequelize');
const { Users, Trainings, Points, Subscriptions } = require('../db/sequelize');
const { userAttributes } = require('../db/attributes');
const path = require("path");
const fs = require("fs");
const {
    verifyAccessToken,
    checkValidation
} = require('./index');
const bcrypt = require('bcrypt');



class profileController {

    async loadImage(req, res) {
        try {
            const user = await Users.findByPk(req.user.id)
            let oldAvatar;

            if (user.avatar) {
                oldAvatar = user.avatar;
            }
            user.avatar = req.file.filename;
            user.save();
            if (oldAvatar) {
                fs.unlink('data/image/' + oldAvatar, err => {
                    if (err) {
                        console.log(err)
                        return
                    };
                    console.log('Файл data/image/' + oldAvatar + ' удалён');
                });
            }

            return res.json({
                newAvatar: req.file.filename,
            });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async changeName(req, res) {
        try {
            const user = await Users.findByPk(req.user.id)

            user.name = req.body.name;
            user.surname = req.body.surname;
            user.save();

            return res.json({
                message: "success",
            });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async changePassword(req, res) {
        try {

            const user = await Users.findByPk(req.user.id)

            if (!await bcrypt.compare(req.body.oldPassword, user.password))
                throw new Error();
            user.password = await bcrypt.hash(req.body.newPassword, 10);
            user.save();

            return res.json({
                message: "success",
            });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async subscribe(req, res) {
        try {
            const user = req.user;
            const id = req.params.id;

            await Subscriptions.create({
                from: user.id,
                to: id,
            });
            return res.json({
                message: "success",
            });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async unsubscribe(req, res) {
        try {
            const user = req.user;
            const id = req.params.id;

            await Subscriptions.destroy({
                where: {
                    from: user.id,
                    to: id,
                }
            });

            return res.json({
                message: "success",
            });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }
}

module.exports = new profileController();