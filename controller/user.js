const { Sequelize } = require('sequelize');
const { Users, Trainings, Points } = require('../db/sequelize');
const { userAttributes } = require('../db/attributes');


class userController {


    async getList(req, res) {
        try {
            const search = req.query.search;
            let page = Number(req.query.page);
            let where = {};
            let limit = 10;
            let offset = 0;

            if (search) {
                where = {
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
            }
            if (Number.isInteger(page) && page > 1) {
                offset = (page - 1) * limit
            }
            return res.json({
                users: await Users.findAll({
                    attributes: userAttributes,
                    where: where,
                    limit,
                    offset
                }),
            })

        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async getUser(req, res) {
        try {
            const id = req.params.id;

            const user = await Users.findByPk(id, {
                attributes: userAttributes,
            });
            if (!user) {
                return res.sendStatus(404);
            }

            return res.json({
                ...user.toJSON()
            });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async getTrainings(req, res) {
        try {
            const id = req.params.id;

            let page = Number(req.query.page);
            let limit = req.query.limit ? req.query.limit : 3;
            let offset = 0;

            if (Number.isInteger(page) && page > 1) {
                offset = (page - 1) * limit
            }

            const trainings = await Trainings.findAll({
                limit,
                offset,
                where: {
                    user_id: id,
                },
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
                    ["start_time", "Desc"],
                    ["id", "ASC"],
                    [Points, 'time', 'ASC']
                ],
            });

            return res.json({ trainings });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }
}

module.exports = new userController();