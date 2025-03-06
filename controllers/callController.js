const Contact = require('../models/Contact');
const CallLog = require('../models/CallLog');
const twilioService = require('../services/twilioService');

const startCalling = async (req, res) => {
    try {
        // Check if an agent is already on a call
        const activeCall = await Contact.findOne({ where: { on_call: true } });

        if (activeCall) {
            return res.status(400).json({ message: 'Agent is on a call. Waiting for the call to end.' });
        }

        // Fetch next pending contact
        const nextContact = await Contact.findOne({ where: { status: 'pending', on_call: false } });

        if (!nextContact) {
            return res.status(400).json({ message: 'No pending contacts to call.' });
        }

        // Mark the contact as "on call"
        await nextContact.update({ on_call: true });

        // Initiate the call using Twilio
        await twilioService.makeConferenceCall(nextContact);

        res.status(200).json({ message: `Calling ${nextContact.phone_number}` });
    } catch (error) {
        console.error('Error starting calls:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Twilio IVR Menu (TwiML Response)
const voiceMenu = (req, res) => {
    const response = `
        <Response>
            <Gather action="/api/call/response" method="POST" numDigits="1">
                <Say>Hello, are you interested in this offer? Press 1 for Yes, Press 2 for No.</Say>
            </Gather>
            <Say>We didn't receive a response. Goodbye.</Say>
            <Hangup/>
        </Response>
    `;
    res.type('text/xml').send(response);
};

const handleCallResponse = async (req, res) => {
    try {
        const { CallSid, Digits, From } = req.body;
        const contact = await Contact.findOne({ where: { phone_number: From } });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }

        let callStatus = 'answered';
        let response = 'none';

        if (Digits === '1') {
            response = 'yes';
            // Transfer call to admin (Nicky)
            await twilioService.transferCall(CallSid);
        } else if (Digits === '2') {
            response = 'no';
        }

        // Log the response in CallLogs
        await CallLog.create({
            contact_id: contact.id,
            call_status: callStatus,
            response: response
        });

        // Update contact status
        await contact.update({ status: response === 'yes' ? 'called' : 'no_answer' });

        res.status(200).send('Call response logged successfully.');
    } catch (error) {
        console.error('❌ Error handling call response:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Twilio webhook: Call ends, update database
const handleCallEnd = async (req, res) => {
    try {
        const { CallSid, From } = req.body;

        const contact = await Contact.findOne({ where: { phone_number: From } });

        if (contact) {
            await contact.update({ on_call: false, status: 'called' });
        }

        console.log(`✅ Call ended for ${From}, ready for next call.`);
        res.status(200).send('Call status updated.');
    } catch (error) {
        console.error('Error updating call status:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = { startCalling, voiceMenu, handleCallResponse, handleCallEnd };
