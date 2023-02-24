const express = require('express');
const app = express();
const server = require('http').Server(app);
const { Users, Trainings } = require('./db/sequelize');
// const fs = require('fs');

const authRouter = require('./routes/auth');


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



app.get("/", async (req, res) => {
    // const aboba = await Users.findOne({
    //     where: {
    //         id: 1
    //     },
    //     include: Trainings
    // });
    // const tr_aboba = await aboba.getTrainings();
    // console.log(aboba.toJSON());

    res.json({
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
    const trainings = (await db.query(
        'SELECT * FROM trainings'
    )).rows;

    return res.json({
        message: "ok",
        trainings
    });
})

app.post("/add/training", async (req, res) => {
    try {
        const { trajectory } = req.body;
        if (
            trajectory !== undefined
        ) {
            const json = JSON.stringify({ trajectory });
            const newTraining = (await db.query(
                'INSERT INTO trainings (user_id, trajectory) values ($1, $2) RETURNING *',
                ["1", trajectory]
            )).rows[0];

            return res.json({ message: "Ok", training: newTraining });
        }
    } catch (err) {
        console.log(err);
    }
    return res.sendStatus(400);
});

server.listen(8000);