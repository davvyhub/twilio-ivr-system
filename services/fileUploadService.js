const fs = require('fs');
const { parseCSV } = require('../utils/csvParser');
const { parseXLSX } = require('../utils/xlsxParser');
const Contact = require('../models/Contact');
const path = require('path');

// Function to process uploaded file and save contacts to DB
const processFile = async (filePath) => {
    try {
        const fileExtension = path.extname(filePath).toLowerCase();
        let contacts = [];

        if (fileExtension === '.csv') {
            contacts = await parseCSV(filePath);
        } else if (fileExtension === '.xlsx') {
            contacts = await parseXLSX(filePath);
        } else {
            throw new Error('Unsupported file format. Only CSV and XLSX are allowed.');
        }

        // Bulk insert contacts into DB
        await Contact.bulkCreate(contacts, { ignoreDuplicates: true });

        console.log(`✅ Successfully uploaded ${contacts.length} contacts.`);
        return contacts;
    } catch (error) {
        console.error('❌ Error processing file:', error.message);
        throw new Error('Failed to process file.');
    } finally {
        // Delete the file after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error('⚠️ Failed to delete file:', err.message);
        });
    }
};

module.exports = { processFile };
