/**
 * QUICK SETUP: Standard MongoDB Connection String Generator
 * 
 * This file shows you the EXACT format to use in your .env file
 * 
 * Run: node get-connection-string.js
 */

console.log('\n════════════════════════════════════════════════════════════════');
console.log('MongoDB Atlas Connection String Helper');
console.log('════════════════════════════════════════════════════════════════\n');

console.log('PROBLEM:');
console.log('--------');
console.log('Windows cannot resolve MongoDB SRV records.');
console.log('Solution: Use STANDARD connection string format\n');

console.log('YOUR CURRENT SETUP:');
console.log('-------------------');
console.log('Username: abmszjaela_db_user');
console.log('Cluster:  vimscluster.g1hhrmk.mongodb.net');
console.log('Database: vims\n');

console.log('WHAT TO DO:');
console.log('-----------');
console.log('1. Go to: https://cloud.mongodb.com');
console.log('2. Select your project → Deployments → vimscluster');
console.log('3. Click "CONNECT" button');
console.log('4. Choose "Drivers"');
console.log('5. Select "Node.js" → "4.1 or later"');
console.log('6. Copy the connection string');
console.log('7. Paste it into server/.env as your URI\n');

console.log('EXPECTED FORMAT (from MongoDB Atlas):');
console.log('=====================================');
console.log('mongodb://USER:PASSWORD@HOST1:27017,HOST2:27017,HOST3:27017/DB?');
console.log('ssl=true&replicaSet=REPLICA_SET_NAME&authSource=admin\n');

console.log('EXAMPLE (based on your cluster):');
console.log('================================');
const exampleUri = `mongodb://abmszjaela_db_user:ocaCTdOg3gn1GC2n@\\
vimscluster-shard-00-00.g1hhrmk.mongodb.net:27017,\\
vimscluster-shard-00-01.g1hhrmk.mongodb.net:27017,\\
vimscluster-shard-00-02.g1hhrmk.mongodb.net:27017/vims?\\
ssl=true&replicaSet=vimscluster-shard-0&authSource=admin`;

console.log('URI=mongodb://abmszjaela_db_user:ocaCTdOg3gn1GC2n@\\');
console.log('vimscluster-shard-00-00.g1hhrmk.mongodb.net:27017,\\');
console.log('vimscluster-shard-00-01.g1hhrmk.mongodb.net:27017,\\');
console.log('vimscluster-shard-00-02.g1hhrmk.mongodb.net:27017/vims?\\');
console.log('ssl=true&replicaSet=vimscluster-shard-0&authSource=admin\n');

console.log('ONE-LINE FORMAT (for .env):');
console.log('===========================');
console.log('URI=mongodb://abmszjaela_db_user:ocaCTdOg3gn1GC2n@vimscluster-shard-00-00.g1hhrmk.mongodb.net:27017,vimscluster-shard-00-01.g1hhrmk.mongodb.net:27017,vimscluster-shard-00-02.g1hhrmk.mongodb.net:27017/vims?ssl=true&replicaSet=vimscluster-shard-0&authSource=admin\n');

console.log('INSTRUCTIONS:');
console.log('=============');
console.log('1. Open: server/.env');
console.log('2. Find the URI= line');
console.log('3. Replace it with the connection string from MongoDB Atlas');
console.log('4. Make sure the PASSWORD matches the one in MongoDB Atlas');
console.log('5. Save the file');
console.log('6. Run: npm start\n');

console.log('VERIFY:');
console.log('=======');
console.log('After updating, run: node diagnose-mongodb.js');
console.log('You should see: ✅ All checks passed!\n');

console.log('════════════════════════════════════════════════════════════════\n');
