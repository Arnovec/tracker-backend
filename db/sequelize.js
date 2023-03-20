const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('athletics_track', 'dron61', '123', {
    host: 'localhost',
    port: "5500",
    dialect: 'postgres',
    define: {
        freezeTableName: true,
        timestamps: false,
        // underscored: true
    }
});
// sequelize.sync({ logging: console.log })


const Users = sequelize.define('users', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    surname: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
}, {
    // Other model options go here
});

const Trainings = sequelize.define('trainings', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    distance: {
        type: DataTypes.INTEGER,
    },
    time: {
        type: DataTypes.INTEGER,
    },
    temp: {
        type: DataTypes.INTEGER,
    },
    start_time: {
        type: DataTypes.BIGINT,
    },
}, {
    // Other model options go here
});

const Points = sequelize.define('points', {
    training_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    part: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    latitude: {
        type: DataTypes.REAL,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.REAL,
        allowNull: false,
    },
}, {

});

Users.hasMany(Trainings, { foreignKey: "user_id", sourceKey: "id" });
Trainings.belongsTo(Users, {
    foreignKey: "user_id",
    sourceKey: "id",
    onDelete: "CASCADE",
});
Trainings.hasMany(Points, { foreignKey: "training_id", sourceKey: "id" });
Points.belongsTo(Trainings, { foreignKey: "training_id", sourceKey: "id" });

module.exports = { Users, Trainings, Points }