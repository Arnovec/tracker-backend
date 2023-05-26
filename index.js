const express = require('express');
const app = express();
const server = require('http').Server(app);
const { Users, Trainings, Points, PacePerKilometer } = require('./db/sequelize');
const { Sequelize } = require('sequelize');
const { getDistanceFromLatLon } = require('./controller/geo');
const path = require("path");
const fs = require('fs');


// "mysql2": "^3.2.0",
//"pg": "^8.7.1",


const authRouter = require('./routes/auth');
const trainingRouter = require('./routes/training');
const userRouter = require('./routes/user');
const profileRouter = require('./routes/profile');


const cors = require('cors');
const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
}

app.use(cors(corsOpts));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/trainings', trainingRouter);
app.use('/api/users', userRouter);
app.use('/api/profile', profileRouter);



app.get("/", async (req, res) => {
    // const aboba = await Users.findOne({
    //     where: {
    //         id: 1
    //     },
    //     include: Trainings
    // });
    // const tr_aboba = await aboba.getTrainings();
    // console.log(aboba.toJSON());

    return res.json({
        message: "aboba",
    })
});

app.get("/img/:fileName", (req, res) => {
    // console.log()
    try {
        const filePath = path.join(__dirname, `/data/image/${req.params.fileName}`);
        fs.stat(filePath, function (err, stats) {
            if (err) {
                return res.sendFile(path.join(__dirname, `/data/image/default.png`));
            } else {
                return res.sendFile(filePath);
            }
        });
    } catch (err) {
        return res.sendFile(path.join(__dirname, `/data/image/default.png`));
    }
});

app.get("/news", async (req, res) => {
    const trainings = await Trainings.findAll({
        raw: true
    });
    console.log("qwe");

    return res.json({ trainings });
});

app.get("/temp", async (req, res) => {
    try {
        const users = await Users.findAll({
            order: [
                ["id", "asc"]
            ],
            raw: true
        });

        // users.forEach(async (elem) => {
        for (const elem of users) {

            console.log("-------------------------")
            console.log(elem.id)
            const fast_training = await Trainings.findOne({
                order: [
                    ["pace", "asc"]
                ],
                where: {
                    user_id: elem.id,
                }
            })

            if (fast_training) {
                console.log("fast", fast_training.toJSON().id)
                fast_training.best_pace = true;
                fast_training.save();
            }

            const bigest_training = await Trainings.findOne({
                order: [
                    ["distance", "desc"]
                ],
                where: {
                    user_id: elem.id,
                }
            })

            if (bigest_training) {
                console.log("bigest", bigest_training.toJSON().id)
                bigest_training.best_distance = true;
                bigest_training.save();
            }
        }
        // })


        const trainings = await Trainings.findAll({
            order: [
                ["user_id", "asc"]
            ],
        })

        return res.json({
            trainings
        });
    } catch (err) {
        console.log(err);
    }
    return res.sendStatus(404);
});

server.listen(8000);
//lt --port 8000 --subdomain basckend