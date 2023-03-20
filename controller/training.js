const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Users, Trainings, Points } = require('../db/sequelize');
const { userAttributes } = require('../db/attributes');
const {
    checkAccessToken,
    checkValidation
} = require('./index');


class trainingController {

    async add(req, res) {
        try {
            const { training } = req.body;
            console.log("------------------------------------------")
            console.log(training);
            console.log("------------------------------------------")
            checkValidation(req);
            const authHeader = req.headers["authorization"];
            const token = authHeader.split(" ")[1];

            const user = await checkAccessToken(token);


            const newTraining = Trainings.build(
                {
                    user_id: 31,//user.id
                    ...training
                },
                { include: [Points] }
            );
            // points.forEach(elem => {
            //     const newPoint = Points.build({
            //         ...elem,
            //         training_id: newTraining.id
            //     })
            //     newTraining.addPoint(newPoint)
            // });

            console.log("newTraining ", newTraining);
            newTraining.save();

            return res.json({ message: "Ok" });
        } catch (error) {
            console.log(error);
        }
        return res.sendStatus(401);
    }

    async getList(req, res) {
        try {
            let page = Number(req.query.page);
            let limit = req.query.limit ? req.query.limit : 3;
            let offset = 0;

            if (Number.isInteger(page) && page > 1) {
                offset = (page - 1) * limit
            }

            const trainings = await Trainings.findAll({
                limit,
                offset,
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
                // raw: true,
                // nest : true,


            });


            // console.log("------------------------------------------")
            // console.log(trainings)
            // console.log("------------------------------------------")
            return res.json({ trainings });
        } catch (error) {
            console.log(error);
        }
        return res.sendStatus(401);
    }

}

module.exports = new trainingController();