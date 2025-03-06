const Contact = require('../models/Contact');
const fileUploadService = require('../services/fileUploadService');

// Upload contacts from CSV/XLSX
const uploadContacts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const contacts = await fileUploadService.processFile(req.file.path);

        await Contact.bulkCreate(contacts, { ignoreDuplicates: true });

        res.status(200).json({ message: 'Contacts uploaded successfully.', contacts });
    } catch (error) {
        console.error('Error uploading contacts:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Get all contacts
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Delete a contact
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }

        await contact.destroy();
        res.status(200).json({ message: 'Contact deleted successfully.' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { uploadContacts, getContacts, deleteContact };
