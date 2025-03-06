const { Sequelize } = require('sequelize');

// Load environment variables from .env file
require('dotenv').config();

// Database connection setup
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Set to true if you want to see SQL logs
});

// Test database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        // Auto-create tables (sync models)
        await sequelize.sync({ alter: true });
        console.log('✅ Database tables are up to date.');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
