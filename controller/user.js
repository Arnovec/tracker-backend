const { Sequelize } = require('sequelize');
const { Users, Trainings, Points, Subscriptions } = require('../db/sequelize');
const { userAttributes } = require('../db/attributes');
const {
    verifyAccessToken,
    checkValidation
} = require('./index');


class userController {


    async getList(req, res) {
        try {
            const search = req.query.search;
            let last_id = Number(req.query.last_id);
            let where = {};
            let limit = 14;

            if (search) {
                Object.assign(
                    where,
                    {
                        [Sequelize.Op.or]: [
                            Sequelize.where(
                                Sequelize.fn('concat', Sequelize.col('name'), ' ', Sequelize.col('surname')),
                                {
                                    [Sequelize.Op.like]: `%${search}%`
                                }
                            ),
                            Sequelize.where(
                                Sequelize.fn('concat', Sequelize.col('surname'), ' ', Sequelize.col('name')),
                                {
                                    [Sequelize.Op.iLike]: `%${search}%`
                                }
                            )
                        ]
                    }
                )
            }
            if (Number.isInteger(last_id)) {
                Object.assign(where, {
                    [Sequelize.Op.and]: {
                        id: {
                            [Sequelize.Op.lt]: last_id
                        }
                    }
                })
            }

            const elements = await Users.findAll({
                attributes: userAttributes,
                where: where,
                limit,
                order: [
                    ["id", "Desc"],
                ],
            });
            return res.json({
                elements
            });

        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async getUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await Users.findByPk(id, {
                attributes: userAttributes,
            });

            if (!user) {

                return res.sendStatus(404);
            }

            return res.json(user.toJSON());
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async isSubscribe(req, res) {
        try {
            const id = req.params.id * 1;

            const user2 = req.user;
            

            if (user2.id == id) {

                throw -1;
            }
            const subscriptions = await Subscriptions.findOne({
                where: {
                    from: user2.id,
                    to: id,
                }
            });

            if (subscriptions) {

                return res.json({
                    isSubscribe: true,
                });
            }

            return res.json({
                isSubscribe: false,
            });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async getFeed(req, res) {
        try {
            const id = req.params.id;

            let limit = req.query.limit ? req.query.limit : 3;
            let last_id = Number(req.query.last_id);
            let where = {};

            if (Number.isInteger(last_id)) {
                where.id = {
                    [Sequelize.Op.lt]: last_id,
                };
            }

            const subscribe_ = (await Subscriptions.findAll({
                attributes: ["to"],
                where: {
                    from: id
                }
            })).map(elem => elem.to);
            where.user_id = {
                [Sequelize.Op.or]: subscribe_
            }

            const trainings = await Trainings.findAll({
                limit,
                where,
                include: [
                    {
                        model: Users,
                        attributes: userAttributes,
                    },
                    {
                        model: Points,
                    },

                ],
                order: [
                    ["id", "Desc"],
                    [Points, 'time', 'ASC']
                ],
            });

            return res.json({
                elements: trainings
            });

        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async getTrainings(req, res) {
        try {
            let limit = req.query.limit ? req.query.limit : 3;
            const id = req.params.id;
            let last_id = Number(req.query.last_id);
            let where = {
                user_id: id,
            };

            if (Number.isInteger(last_id)) {
                where.id = {
                    [Sequelize.Op.lt]: last_id
                }
            }

            const trainings = await Trainings.findAll({
                limit,
                where,
                include: [
                    {
                        model: Users,
                        attributes: userAttributes,
                    },
                    {
                        model: Points,
                    }
                ],
                order: [
                    ["id", "Desc"],
                    [Points, 'time', 'ASC']
                ],
            });

            return res.json({
                elements: trainings
            });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

}

module.exports = new userController();