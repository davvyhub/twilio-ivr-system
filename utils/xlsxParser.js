const xlsx = require('xlsx');

const parseXLSX = (filePath) => {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });

        const contacts = data.map((row) => ({
            name: row.Name || 'Unknown',
            phone_number: row.Phone || row['Phone Number'],
            status: 'pending',
        }));

        return contacts;
    } catch (error) {
        console.error('❌ Error parsing XLSX file:', error.message);
        return [];
    }
};

module.exports = { parseXLSX };
