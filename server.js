const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const callRoutes = require('./routes/callRoutes');
const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS

// Routes
app.use('/api/call', callRoutes);
app.use('/api/contacts', contactRoutes);

// Serve static files (for frontend)
app.use(express.static('public'));

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
