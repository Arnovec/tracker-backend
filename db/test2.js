const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize('postgres://nikita:0000@192.168.125.8:5432/test');
const sequelize = new Sequelize('test', 'nikita', '0000', {
    host: '25.55.124.157',
    port: "5432",
    dialect: 'postgres',
    define: {
        freezeTableName: true,
        timestamps: false,
        // underscored: true
    }
});
// sequelize.sync({ logging: console.log })


const Tests = sequelize.define('user2', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },

    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    // Other model options go here

});

// Tests.sync({ force: true })


module.exports = { Tests }