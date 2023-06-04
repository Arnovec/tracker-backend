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
            const user = req.user;

            const statistic = getStatisticByPoints(points)

            const fast_training = await Trainings.findOne({
                order: [
                    ["pace", "asc"]
                ],
                where: {
                    user_id: user.id,
                }
            })
            const bigest_training = await Trainings.findOne({
                order: [
                    ["distance", "desc"]
                ],
                where: {
                    user_id: user.id,
                }
            })

            let best_distance = false;
            let best_pace = false;

            if (bigest_training && bigest_training.distance <= statistic.distance) {
                best_distance = true;
                if (bigest_training.distance < statistic.distance) {
                    bigest_training.best_distance = false;
                    bigest_training.save();
                }
            }
            if (fast_training && fast_training.pace >= statistic.pace) {
                best_pace = true;
                if (fast_training.pace > statistic.pace) {
                    fast_training.best_pace = false;
                    fast_training.save();
                }
            }

            const training = {
                points,
                user_id: user.id,
                ...statistic,
                best_distance,
                best_pace,
            }

            const newTraining = Trainings.build(
                training,
                {
                    include: [
                        Points,
                        PacePerKilometer
                    ]
                }
            );

            await newTraining.save();

            return res.json(newTraining.toJSON());
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
                    ["id", "Desc"],
                    [Points, 'time', 'ASC']
                ],
            });


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
                    [Points, 'time', 'ASC'],
                    [PacePerKilometer, 'kilometer', 'ASC']
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