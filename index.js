const express = require('express');
const app = express();
const server = require('http').Server(app);
const { Users, Trainings, Points, PacePerKilometer } = require('./db/sequelize');
const { Sequelize } = require('sequelize');
const { getDistanceFromLatLon } = require('./controller/geo');
const path = require("path");
const fs = require('fs');

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

    return res.json({
        message: "aboba",
    })
});

app.get("/img/:fileName", (req, res) => {
    try {
        const filePath = path.join(__dirname, `/data/image/${req.params.fileName}`);
        fs.stat(filePath, function (err, stats) {
            if (err) {
                return res.sendFile(path.join(__dirname, `/data/image/RRUe0Mo.png`));
            } else {
                return res.sendFile(filePath);
            }
        });
    } catch (err) {
        return res.sendFile(path.join(__dirname, `/data/image/RRUe0Mo.png`));
    }
});


server.listen(8000);
//lt --port 8000 --subdomain basckend