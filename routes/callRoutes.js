const express = require('express');
const { startCalling, handleCallResponse } = require('../controllers/callController');

const router = express.Router();

// Start calling pending contacts
router.post('/start', startCalling);

// IVR voice menu response
router.post('/voice-menu', voiceMenu);

// Handle Twilio webhook response
router.post('/response', handleCallResponse);

// Start calls (only if no active call)
router.post('/start', startCalling);

// Webhook: Call ended
router.post('/call-end', handleCallEnd);

// Conference call setup
router.post('/conference', handleConference);

module.exports = router;
