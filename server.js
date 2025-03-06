const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const callRoutes = require('./routes/callRoutes');
const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/call', callRoutes);
app.use('/api/contacts', contactRoutes);

// Home page (Dashboard for Upload & Calls)
app.get('/', (req, res) => {
    res.render('index');  // Renders views/index.ejs
});

// Call Logs Page
app.get('/call-logs', (req, res) => {
    res.render('callLogs');  // Renders views/callLogs.ejs
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const startServer = async () => {
    try {
        await connectDB(); // Connect to database
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};

startServer();
