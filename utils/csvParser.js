const fs = require('fs');
const csv = require('csv-parser');

const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const contacts = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (row.phone_number) {
                    contacts.push({
                        name: row.name || 'Unknown',
                        phone_number: row.phone_number,
                        status: 'pending',
                    });
                }
            })
            .on('end', () => resolve(contacts))
            .on('error', (error) => reject(error));
    });
};

module.exports = { parseCSV };
