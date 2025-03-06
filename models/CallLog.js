const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Contact = require('./Contact');

const CallLog = sequelize.define('CallLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    contact_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Contact,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    call_status: {
        type: DataTypes.ENUM('answered', 'no_answer', 'failed', 'transferred'),
        allowNull: false
    },
    response: {
        type: DataTypes.ENUM('yes', 'no', 'none'),
        allowNull: false,
        defaultValue: 'none'
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true
});

Contact.hasMany(CallLog, { foreignKey: 'contact_id' });
CallLog.belongsTo(Contact, { foreignKey: 'contact_id' });

module.exports = CallLog;
