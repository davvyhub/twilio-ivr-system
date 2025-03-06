const { sequelize } = require('../config/db');
const Contact = require('../models/Contact');
const CallLog = require('../models/CallLog');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Drops and recreates tables
        console.log('✅ Database synced and reset.');

        // Sample contacts
        const contacts = [
            { name: 'John Doe', phone_number: '+1234567890', status: 'pending' },
            { name: 'Alice Johnson', phone_number: '+1987654321', status: 'pending' },
            { name: 'Michael Smith', phone_number: '+1765432198', status: 'pending' }
        ];

        await Contact.bulkCreate(contacts);
        console.log('✅ Sample contacts added.');

        // Sample call logs (optional)
        const logs = [
            { contact_id: 1, call_status: 'answered', response: 'yes', timestamp: new Date() },
            { contact_id: 2, call_status: 'no_answer', response: 'none', timestamp: new Date() }
        ];

        await CallLog.bulkCreate(logs);
        console.log('✅ Sample call logs added.');

        console.log('🎉 Database seeding complete.');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeding script
seedDatabase();
