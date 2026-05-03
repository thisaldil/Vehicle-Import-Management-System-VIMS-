const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.URI;

const connectDB = async () => {
    try {
        const mongooseOptions = {
            // Timeout Settings (Windows DNS fix)
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            
            // Connection Pool
            maxPoolSize: 10,
            minPoolSize: 2,
            
            // Windows-specific fixes
            family: 4, // Force IPv4 — fixes querySrv ECONNREFUSED
        };

        console.log('Attempting MongoDB Atlas connection...');
        await mongoose.connect(uri, mongooseOptions);
        
        if (process.env.NODE_ENV !== 'deployment') {
            console.log('✅ Database connection success');
            const clusterName = uri.match(/@([^.]+\.[^/]+)/)?.[1] || 'MongoDB Atlas';
            console.log(`   Connected to: ${clusterName}`);
        }
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        console.error('\n📋 Troubleshooting:');
        console.error('1. Verify MongoDB Atlas cluster is running');
        console.error('2. Check IP whitelist in MongoDB Atlas (should include 0.0.0.0/0)');
        console.error('3. Verify URI in .env file is correct');
        console.error('4. Try DNS flush: ipconfig /flushdns (Windows)');
        console.error('5. Check your internet connection');
        console.error('6. Run: node diagnose-mongodb.js for detailed diagnostics\n');
        process.exit(1); 
    }
};

module.exports = connectDB;