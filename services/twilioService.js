const twilio = require('twilio');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = require('../config/twilioConfig');

const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Make a call and provide IVR menu
const makeCall = async (contact) => {
    try {
        await client.calls.create({
            to: contact.phone_number,
            from: TWILIO_PHONE_NUMBER,
            url: 'https://your-server.com/api/call/voice-menu' // Fetch TwiML from this endpoint
        });
        console.log(`📞 Calling ${contact.phone_number}`);
    } catch (error) {
        console.error(`❌ Failed to call ${contact.phone_number}:`, error.message);
    }
};

// Transfer call to admin (if user presses 1)
const transferCall = async (callSid) => {
    try {
        await client.calls(callSid).update({
            twiml: `<Response><Dial>${process.env.ADMIN_PHONE_NUMBER}</Dial></Response>`,
        });
        console.log('📞 Call transferred to admin.');
    } catch (error) {
        console.error('❌ Failed to transfer call:', error.message);
    }
};


// Start a conference call
const makeConferenceCall = async (contact) => {
    try {
        await client.calls.create({
            to: contact.phone_number,
            from: TWILIO_PHONE_NUMBER,
            url: 'https://your-server.com/api/call/conference',
        });
        console.log(`📞 Calling ${contact.phone_number} and joining conference.`);
    } catch (error) {
        console.error(`❌ Failed to call ${contact.phone_number}:`, error.message);
    }
};

// Transfer call into a conference
const handleConference = (req, res) => {
    const response = `
        <Response>
            <Say>Connecting you to an agent now.</Say>
            <Dial>
                <Conference>SupportRoom</Conference>
            </Dial>
        </Response>
    `;
    res.type('text/xml').send(response);
};


module.exports = { makeCall, transferCall, makeConferenceCall, handleConference };
