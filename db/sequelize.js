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
    pace: {
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

const Subscriptions = sequelize.define('subscriptions', {
    // Model attributes are defined here
    from: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    to: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
}, {
    // Other model options go here
});

const PacePerKilometer = sequelize.define("pace_per_kilometer", {
    training_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    kilometer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    pace: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    // tableName: "pace_per_kilometer",
    // name: { plural: "pacePerKilometer" }
})

Users.hasMany(Trainings, { as: "trainings", foreignKey: "user_id", sourceKey: "id" });
Trainings.belongsTo(Users, {
    foreignKey: "user_id",
    sourceKey: "id",
    // onDelete: "CASCADE",
});

Trainings.hasMany(Points, { foreignKey: "training_id", sourceKey: "id" });
Points.belongsTo(Trainings, { foreignKey: "training_id", sourceKey: "id" });

Trainings.hasMany(PacePerKilometer, { foreignKey: "training_id", sourceKey: "id" });
PacePerKilometer.belongsTo(Trainings, { foreignKey: "training_id", sourceKey: "id" });

Users.belongsToMany(Users, { through: Subscriptions, as: "subscribers", foreignKey: 'from', sourceKey: 'id' });
Users.belongsToMany(Users, { through: Subscriptions, as: "respondents", foreignKey: 'to', sourceKey: 'id' });


module.exports = { Users, Trainings, Points, PacePerKilometer, Subscriptions }