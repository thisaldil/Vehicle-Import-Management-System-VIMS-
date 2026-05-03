# MongoDB Atlas Connection Fix - Complete Guide

## Problem Identified

**Error**: `querySrv ECONNREFUSED _mongodb._tcp.vimscluster.g1hhrmk.mongodb.net`

**Cause**: Windows DNS cannot resolve MongoDB Atlas SRV records. This is a known Windows/DNS issue with `mongodb+srv://` connection strings.

---

## ✅ SOLUTION: Switch to Standard Connection String

### Step 1: Get Your Standard Connection String from MongoDB Atlas

1. **Go to**: https://cloud.mongodb.com/v2
2. **Click your project** → **Deployments** → **vimscluster** 
3. **Click "Connect"** button
4. **Select "Drivers"** (not "Connect with MongoDB Compass")
5. **Select "Node.js"** and version **4.1 or later**
6. **Copy** the connection string - it will look like:
   ```
   mongodb+cluster://user:password@host1,host2,host3/?ssl=true&...
   ```

### Step 2: Extract the Standard Connection String

Instead of `mongodb+srv://`, use `mongodb://` and list the replica set nodes:

**SRV Format (NOT WORKING on Windows):**
```
mongodb+srv://abmszjaela_db_user:PASSWORD@vimscluster.g1hhrmk.mongodb.net/vims
```

**Standard Format (WORKS on Windows):**
```
mongodb://abmszjaela_db_user:PASSWORD@vimscluster-shard-00-00.g1hhrmk.mongodb.net:27017,vimscluster-shard-00-01.g1hhrmk.mongodb.net:27017,vimscluster-shard-00-02.g1hhrmk.mongodb.net:27017/vims?ssl=true&replicaSet=vimscluster-shard-0&authSource=admin
```

### Step 3: Update Your .env File

Replace your `URI` line in `server/.env`:

```env
# Use Standard Connection String (works on Windows)
# Get the exact URL from MongoDB Atlas: Cluster → Connect → Drivers
URI=mongodb://abmszjaela_db_user:ocaCTdOg3gn1GC2n@vimscluster-shard-00-00.g1hhrmk.mongodb.net:27017,vimscluster-shard-00-01.g1hhrmk.mongodb.net:27017,vimscluster-shard-00-02.g1hhrmk.mongodb.net:27017/vims?ssl=true&replicaSet=vimscluster-shard-0&authSource=admin
```

---

## Detailed Setup Instructions

### Option A: Automatic via MongoDB Atlas Dashboard

1. Log in to https://cloud.mongodb.com
2. Go to **Database** → **Deployments**
3. Find **vimscluster** → Click **Connect**
4. Choose **Drivers** tab
5. Select **Node.js** → **Latest version**
6. Copy the connection string
7. Paste into `server/.env` as your `URI`

### Option B: Get Exact Connection Details

If you don't have access to the MongoDB Atlas dashboard, here's what you need:

**You need these details from MongoDB Atlas:**
- Cluster name: `vimscluster`
- Username: `abmszjaela_db_user`
- Password: `ocaCTdOg3gn1GC2n` (from your .env)
- Replica set nodes: (3 node addresses with ports)
- Replica set name: `vimscluster-shard-0` (usually)

**Format:**
```
mongodb://USERNAME:PASSWORD@NODE1:27017,NODE2:27017,NODE3:27017/DATABASE?ssl=true&replicaSet=REPLICA_SET_NAME&authSource=admin
```

---

## Troubleshooting Checklist

### If connection still fails:

✅ **Verify MongoDB Atlas Status**
- [ ] Go to https://cloud.mongodb.com
- [ ] Check if cluster `vimscluster` shows "RUNNING"
- [ ] If stopped, click "Resume" button

✅ **Check IP Whitelist**
- [ ] Go to **Network Access** in MongoDB Atlas
- [ ] Ensure `0.0.0.0/0` is listed (allows all IPs)
- [ ] Or add your specific IP address

✅ **Verify Credentials**
- [ ] Username: `abmszjaela_db_user` ✓
- [ ] Password in `.env`: `ocaCTdOg3gn1GC2n` ✓
- [ ] Matches what's in MongoDB Atlas

✅ **Test Connection**
- [ ] Run: `node diagnose-mongodb.js`
- [ ] Should now show **✅ PASS** for all checks

✅ **Windows DNS Settings**
- [ ] Flush DNS: `ipconfig /flushdns`
- [ ] Try alternate DNS: `8.8.8.8` and `8.8.4.4`

✅ **Firewall/Antivirus**
- [ ] Check Windows Firewall allows Node.js
- [ ] Disable VPN temporarily to test
- [ ] Check corporate firewall rules

---

## Testing the Connection

### Test with Diagnostic Script
```bash
cd server
node diagnose-mongodb.js
```

Expected output on success:
```
✅ All checks passed! Your connection is working.
```

### Test with Server
```bash
npm start
```

Expected output on success:
```
Attempting MongoDB Atlas connection...
API running locally at http://localhost:5000
✅ Database connection success
   Connected to: vimscluster.g1hhrmk.mongodb.net
```

---

## Quick Reference

| Issue | Fix |
|-------|-----|
| `querySrv ECONNREFUSED` | Use Standard Connection String (not `mongodb+srv://`) |
| `ECONNREFUSED` | Check MongoDB Atlas cluster is running |
| `Authentication failed` | Verify username/password in URI |
| `ECONNREFUSED` on port 27017 | Check IP whitelist in Network Access |
| DNS timeout | Flush DNS: `ipconfig /flushdns` |

---

## Alternative: Docker MongoDB (Local Testing)

If MongoDB Atlas keeps failing, you can test locally with Docker:

```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

Then use local URI:
```
URI=mongodb://localhost:27017/vims
```

---

## Still Having Issues?

1. **Run diagnostic script**: `node diagnose-mongodb.js`
2. **Check error message** carefully
3. **Verify each step** in the checklist above
4. **Copy exact connection string** from MongoDB Atlas dashboard
5. **Contact MongoDB Support** if cluster is down

---

## Files Updated

✅ `server/.env` - Contains MongoDB connection string
✅ `server/database.js` - Enhanced error messages
✅ `server/diagnose-mongodb.js` - Created for testing connection

Once you update your URI with the Standard Connection String, run `npm start` again!
