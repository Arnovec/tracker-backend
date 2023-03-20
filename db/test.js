const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('tests', 'nikita', '0000', {
    host: 'localhost',
    port: "5432",
    dialect: 'postgres',
    define: {
        freezeTableName: true,
        timestamps: false,
        // underscored: true
    }
});
// new Sequelize('tests', 'dron61', '123', {
//     host: 'https://baza.loca.lt/',
//     port: "5500",
//     dialect: 'postgres',
//     define: {
//         freezeTableName: true,
//         timestamps: false,
//         // underscored: true
//     }
// });
// sequelize.sync({ logging: console.log })


const Users = sequelize.define('users', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    // Other model options go here
});

// Users.sync({ force: true })

module.exports = { Users }