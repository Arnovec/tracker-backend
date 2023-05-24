const express = require('express');
const app = express();
const server = require('http').Server(app);
const { Users, Trainings, Points, PacePerKilometer } = require('./db/sequelize');
const { Sequelize } = require('sequelize');
const { getDistanceFromLatLon } = require('./controller/geo');
// const fs = require('fs');


// "mysql2": "^3.2.0",
//"pg": "^8.7.1",


const authRouter = require('./routes/auth');
const trainingRouter = require('./routes/training');
const userRouter = require('./routes/user');


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

app.get("/news", async (req, res) => {
    const trainings = await Trainings.findAll({
        raw: true
    });
    console.log("qwe");

    return res.json({ trainings });
});

app.get("/temp", async (req, res) => {
    try {

        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
    }
    return res.sendStatus(404);
});

server.listen(8000);
//lt --port 8000 --subdomain basckend