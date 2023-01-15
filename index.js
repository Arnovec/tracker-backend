const express = require('express');
const app = express();
const server = require('http').Server(app);
const db = require('./db');
const fs = require('fs');

// добавить Sequelize

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

app.get("/", (req, res) => {
    res.json({
        message: "aboba",
    })
});

app.get("/news", async (req, res) => {
    const trainings = (await db.query(
        'SELECT * FROM trainings'
    )).rows;

    return res.json({ trainings });
});

app.post("/add/training", async (req, res) => {
    try {
        const { trajectory } = req.body;
        if (
            trajectory !== undefined
        ) {
            const json = JSON.stringify({ trajectory });
            const newTraining = (await db.query(
                'INSERT INTO trainings (user_id, trajectory) values ($1, $2) RETURNING *',
                ["1", json]
            )).rows[0];

            return res.json({ message: "Ok", training: newTraining });
        }
    } catch (err) {
        console.log(err);
    }
    return res.sendStatus(400);
});

server.listen(8000);