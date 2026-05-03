const mongoose = require('mongoose');
require('dotenv').config();

/**
 * MongoDB Atlas Connection Diagnostic Script
 * Run: node diagnose-mongodb.js
 * 
 * This script checks:
 * 1. Environment variables are loaded
 * 2. Connection string format is valid
 * 3. DNS resolution works
 * 4. MongoDB Atlas cluster is reachable
 * 5. Authentication credentials are correct
 */

const uri = process.env.URI;

console.log('\n════════════════════════════════════════════════════════════');
console.log('🔍 MongoDB Atlas Connection Diagnostic');
console.log('════════════════════════════════════════════════════════════\n');

// Check 1: Environment Variable
console.log('✓ Check 1: Environment Variable');
if (!uri) {
    console.log('  ❌ FAILED: URI not found in .env file');
    process.exit(1);
} else {
    // Hide actual password for security
    const maskedUri = uri.replace(/:[^:@]+@/, ':****@');
    console.log(`  ✅ PASS: URI loaded from .env`);
    console.log(`     ${maskedUri.substring(0, 80)}...\n`);
}

// Check 2: Connection String Format
console.log('✓ Check 2: Connection String Format');
const isValidFormat = uri.startsWith('mongodb+srv://') || uri.startsWith('mongodb://');
if (!isValidFormat) {
    console.log('  ❌ FAILED: Connection string must start with mongodb:// or mongodb+srv://');
    process.exit(1);
} else {
    console.log(`  ✅ PASS: Connection string format is valid\n`);
}

// Check 3: Cluster Name Extraction
console.log('✓ Check 3: Cluster Information');
const clusterMatch = uri.match(/@([^.]+\.[^/]+)/);
if (clusterMatch) {
    console.log(`  ✅ Cluster: ${clusterMatch[1]}\n`);
} else {
    console.log('  ⚠️  Warning: Could not extract cluster name\n');
}

// Check 4: DNS Resolution (For SRV lookups)
console.log('✓ Check 4: DNS Resolution Test');
const dns = require('dns');
const srvRecord = '_mongodb._tcp.vimscluster.g1hhrmk.mongodb.net';

dns.resolveSrv(srvRecord, (err, addresses) => {
    if (err) {
        console.log(`  ⚠️  DNS SRV lookup failed: ${err.message}`);
        console.log(`     This is common on Windows. Using directConnection=true in URI.\n`);
    } else {
        console.log(`  ✅ PASS: DNS SRV resolution successful`);
        console.log(`     Found ${addresses.length} record(s)\n`);
    }

    // Check 5: Mongoose Connection
    console.log('✓ Check 5: Mongoose Connection Test');
    console.log('  ⏳ Connecting to MongoDB Atlas... (timeout: 15s)\n');

    const mongooseOptions = {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        maxPoolSize: 5,
        family: 4,
        retryReads: true,
        retryWrites: false,
        authSource: 'admin',
    };

    mongoose.connect(uri, mongooseOptions)
        .then(() => {
            console.log('  ✅ PASS: Successfully connected to MongoDB Atlas!');
            console.log('\n════════════════════════════════════════════════════════════');
            console.log('✅ All checks passed! Your connection is working.');
            console.log('════════════════════════════════════════════════════════════\n');
            process.exit(0);
        })
        .catch((err) => {
            console.log(`  ❌ FAILED: Could not connect to MongoDB Atlas`);
            console.log(`     Error: ${err.message}`);
            console.log('\n════════════════════════════════════════════════════════════');
            console.log('❌ Connection failed. Troubleshooting steps:');
            console.log('════════════════════════════════════════════════════════════\n');
            console.log('1. Verify MongoDB Atlas Cluster:');
            console.log('   - Go to https://cloud.mongodb.com');
            console.log('   - Check if cluster "vimscluster" exists and is running\n');

            console.log('2. Check IP Whitelist:');
            console.log('   - In MongoDB Atlas, go to Network Access');
            console.log('   - Ensure 0.0.0.0/0 (any IP) is whitelisted');
            console.log('   - Or add your specific IP address\n');

            console.log('3. Verify Connection String:');
            console.log(`   - Current: ${uri.substring(0, 60)}...`);
            console.log('   - Get correct string from MongoDB Atlas');
            console.log('   - Cluster → Connect → Copy connection string\n');

            console.log('4. Check Credentials:');
            console.log('   - Username: abmszjaela_db_user');
            console.log('   - Password: Verify in .env file (should not be blank)\n');

            console.log('5. Windows DNS Issue:');
            console.log('   - Try: ipconfig /flushdns');
            console.log('   - Or use directConnection=true in URI (already added)\n');

            console.log('6. Check Internet Connection:');
            console.log('   - Try: ping 8.8.8.8');
            console.log('   - Try: nslookup google.com\n');

            console.log('7. Check Firewall/VPN:');
            console.log('   - Disable VPN temporarily');
            console.log('   - Check Windows Firewall allows Node.js\n');

            process.exit(1);
        });
});
