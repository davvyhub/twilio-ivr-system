const { google } = require('googleapis');
const Contact = require('../models/Contact');

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
    keyFile: 'google-credentials.json', // JSON file with API credentials
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Fetch contacts from Google Sheets
const fetchContactsFromGoogleSheet = async (spreadsheetId, range) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('No data found in Google Sheet.');
            return [];
        }

        const contacts = rows.map((row) => ({
            name: row[0] || 'Unknown',
            phone_number: row[1],
            status: 'pending',
        }));

        // Save to database
        await Contact.bulkCreate(contacts, { ignoreDuplicates: true });

        console.log(`✅ Imported ${contacts.length} contacts from Google Sheets.`);
        return contacts;
    } catch (error) {
        console.error('❌ Error fetching contacts from Google Sheets:', error.message);
        return [];
    }
};

module.exports = { fetchContactsFromGoogleSheet };
