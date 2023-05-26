const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Users, Trainings, Points, PacePerKilometer } = require('../db/sequelize');
const { userAttributes } = require('../db/attributes');
const {
    verifyAccessToken,
    checkValidation
} = require('./index');
const { Sequelize } = require('sequelize');
const { getDistanceFromLatLon } = require('./geo');
const { getStatisticByPoints } = require('./sport');


class trainingController {

    async add(req, res) {
        try {
            const { points } = req.body;
            checkValidation(req);

             // const authHeader = req.headers["authorization"];
            // const token = authHeader.split(" ")[1];

            // const user = await verifyAccessToken(token);
            const user = req.user;

            //Темп по каждому километру
            const training = {
                points,
                user_id: user.id,
                ...getStatisticByPoints(points),
            }

            console.log(training.pace_per_kilometer);

            const newTraining = Trainings.build(
                training,
                {
                    include: [
                        Points,
                        PacePerKilometer
                    ]
                }
            );

            newTraining.save();

            // TODO qwe



            return res.json({ message: "Ok" });
        } catch (error) {
            console.log(error);
        }
        return res.sendStatus(401);
    }

    async getList(req, res) {
        try {
            let limit = req.query.limit ? req.query.limit : 3;
            let last_id = Number(req.query.last_id);
            let where;

            if (Number.isInteger(last_id)) {
                where = {
                    id: {
                        [Sequelize.Op.lt]: last_id
                    }
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


            // console.log("------------------------------------------")
            // console.log(trainings)
            // console.log("------------------------------------------")
            return res.json({
                elements: trainings
            });
        } catch (error) {
            console.log(error);
        }
        return res.sendStatus(401);
    }

    async getTrainingById(req, res) {
        try {
            const id = req.params.id;

            const training = await Trainings.findByPk(id, {
                include: [
                    {
                        model: Users,
                        attributes: userAttributes,
                    },
                    Points, PacePerKilometer,
                ],
                order: [
                    [Points, 'time', 'ASC']
                ],
            });
            if (!training) {
                return res.sendStatus(404);
            }

            return res.json({
                ...training.toJSON()
            });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async getTrainingAnalysisById(req, res) {
        try {
            const id = req.params.id;

            const training = await Trainings.findByPk(id, {
                include: [
                    // {
                    //     model: Users,
                    //     attributes: userAttributes,
                    // },
                    PacePerKilometer,
                ],
                order: [
                    [PacePerKilometer, 'training_id', 'ASC']
                ],
            });
            if (!training) {
                return res.sendStatus(404);
            }

            return res.json({
                ...training.toJSON()
            });
        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }


}

module.exports = new trainingController();