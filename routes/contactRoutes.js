const express = require('express');
const multer = require('multer');
const { uploadContacts, getContacts, deleteContact } = require('../controllers/contactController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Upload directory

// Upload contacts via CSV/XLSX
router.post('/upload', upload.single('file'), uploadContacts);

// Get all contacts
router.get('/', getContacts);

// Delete a contact
router.delete('/:id', deleteContact);

module.exports = router;
