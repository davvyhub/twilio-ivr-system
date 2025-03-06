const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Contact = sequelize.define('Contact', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'called', 'no_answer', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
    },
    on_call: {  // NEW: Track if this contact is currently on a call
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    last_called: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Contact;
