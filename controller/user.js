const { Sequelize } = require('sequelize');
const { Users, Trainings, Points, Subscriptions } = require('../db/sequelize');
const { userAttributes } = require('../db/attributes');
const {
    checkAccessToken,
    checkValidation
} = require('./index');


class userController {


    async getList(req, res) {
        try {
            const search = req.query.search;
            console.log("search", search)
            // let page = Number(req.query.page);
            let last_id = Number(req.query.last_id);
            let where = {};
            let limit = 14;
            // let offset = 0;


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

            // where {
            //     [Symbol(and)]: [ Where { attribute: [Object], comparator: '=', logic: undefined } ]
            // }

            console.log("where", where)
            // if (Number.isInteger(page) && page > 1) {
            //     offset = (page - 1) * limit
            // }
            const elements = await Users.findAll({
                attributes: userAttributes,
                where: where,
                limit,
                order: [
                    ["id", "Desc"],
                ],
                // offset
            });
            console.log("elements length", elements.length)
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
                // include:[
                //     {

                //     }
                // ],
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
            console.log("rerererer");
            const id = req.params.id * 1;
            const authHeader = req.headers["authorization"];
            const token = authHeader.split(" ")[1];
            const user2 = await checkAccessToken(token);
            if (user2.id == id) {

                throw -1;
            }
            const subscriptions = await Subscriptions.findOne({
                where: {
                    from: user2.id,
                    to: id,
                }
            });

            console.log("!!!!!!");
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

            // const u2 = await Users.findByPk(id, {
            //     attributes: [],
            //     include: [
            //         {
            //             model: Trainings,
            //             as: "trainings",
            //             // include: [
            //             //     {
            //             //         model: Users,
            //             //         attributes: userAttributes,
            //             //     },
            //             //     {
            //             //         model: Points,
            //             //     }
            //             // ],
            //         }
            //     ],
            // });

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
                    // ["start_time", "Desc"],
                    ["id", "Desc"],
                    [Points, 'time', 'ASC']
                ],
                // raw: true,
                // nest : true,


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

    async subscribe(req, res) {
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader.split(" ")[1];

            const user = await checkAccessToken(token);
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
            const authHeader = req.headers["authorization"];
            const token = authHeader.split(" ")[1];

            const user = await checkAccessToken(token);
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

module.exports = new userController();