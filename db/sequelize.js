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
    trajectory: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
    }
}, {
    
});

Users.hasMany(Trainings, {foreignKey: "user_id", sourceKey: "id"});

module.exports = { Users, Trainings }