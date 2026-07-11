import mongoose from 'mongoose';
import * as jose from 'jose';
import dotenv from 'dotenv';
import dns from 'dns';

// Fix SRV DNS resolution on local Windows machines
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

// Import Mongoose Models (Must include .js extension)
import User from './models/User.js';
import Device from './models/Device.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ashiyagarg75_db_user:ZHZEXhVQ9T9Zfj3O@cluster0.ksgy8ak.mongodb.net/nettrack?appName=Cluster0';
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key';
const API_URL = 'http://localhost:5000/api';

async function generateToken(userId) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new jose.SignJWT({ id: userId.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);
}

async function runSecurityAudit() {
  console.log('==================================================');
  console.log('          NETTRACK SECURITY & API AUDIT            ');
  console.log('==================================================');

  // Connect to MongoDB
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas...');
  } catch (err) {
    console.error('Database connection failed. Is your internet on? Error:', err.message);
    process.exit(1);
  }

  // 1. Setup Audit Users (Upsert)
  console.log('\n[1] Preparing audit users...');
  
  await User.deleteMany({ username: { $in: ['audit-admin', 'audit-tech', 'audit-client'] } });
  
  const adminUser = await User.create({ username: 'audit-admin', password: 'password123', role: 'admin' });
  const techUser = await User.create({ username: 'audit-tech', password: 'password123', role: 'technician' });
  const clientUser = await User.create({ username: 'audit-client', password: 'password123', role: 'client', clientCompany: 'HDFC' });

  const adminToken = await generateToken(adminUser._id);
  const techToken = await generateToken(techUser._id);
  const clientToken = await generateToken(clientUser._id);

  console.log('Audit users ready with signed JWTs.');

  // 2. Prepare Audit Device
  console.log('\n[2] Preparing target audit devices...');
  // Delete previous audit devices
  await Device.deleteMany({ client: { $in: ['HDFC', 'Cisco', 'AuditCorp'] } });

  // Create one device for HDFC (should be visible to client)
  const hdfcDevice = await Device.create({
    name: 'Audit Router HDFC',
    type: 'Router',
    client: 'HDFC',
    status: 'Active',
    location: 'Server Room'
  });

  // Create one device for Cisco (should NOT be visible to client)
  const ciscoDevice = await Device.create({
    name: 'Audit Switch Cisco',
    type: 'Switch',
    client: 'Cisco',
    status: 'Active',
    location: 'Rack B'
  });

  console.log(`Created target HDFC Device ID: ${hdfcDevice._id}`);
  console.log(`Created target Cisco Device ID: ${ciscoDevice._id}`);

  // Test Results Logger
  const results = [];
  const logResult = (testName, expectedCode, actualCode, status) => {
    results.push({
      'Test Case': testName,
      'Expected Status': expectedCode,
      'Actual Status': actualCode,
      'Result': status ? '✅ PASS' : '❌ FAIL'
    });
  };

  // 3. RUN API TESTS (Using native fetch)
  console.log('\n[3] Triggering security test requests...');

  // --- Test 1: Unauthenticated GET
  try {
    const res = await fetch(`${API_URL}/devices`);
    logResult('Test 1: Unauthenticated GET /devices', 401, res.status, res.status === 401);
  } catch (err) {
    console.error('API Server not responding. Make sure "npm run dev" is running. Error:', err.message);
    mongoose.connection.close();
    process.exit(1);
  }

  // --- Test 2: Client Data Isolation GET
  const resClientGet = await fetch(`${API_URL}/devices`, {
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  const clientDevices = await resClientGet.json();
  const visibleToClient = clientDevices.map(d => d.client);
  const isIsolated = visibleToClient.includes('HDFC') && !visibleToClient.includes('Cisco');
  logResult('Test 2: Client Data Partitioning (GET /devices)', 'Sees HDFC only', isIsolated ? 'Sees HDFC only' : 'Visible: ' + visibleToClient.join(','), isIsolated);

  // --- Test 3: Client POST Attempt (Banned)
  const resClientPost = await fetch(`${API_URL}/devices`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clientToken}` 
    },
    body: JSON.stringify({ name: 'Hack Router', type: 'Router', client: 'HDFC' })
  });
  logResult('Test 3: Client POST /devices (Forbidden)', 403, resClientPost.status, resClientPost.status === 403);

  // --- Test 4: Client DELETE Attempt (Banned)
  const resClientDelete = await fetch(`${API_URL}/devices/${hdfcDevice._id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  logResult('Test 4: Client DELETE /devices/:id (Forbidden)', 403, resClientDelete.status, resClientDelete.status === 403);

  // --- Test 5: Client PUT Attempt - Name Change (Banned / Sanitized)
  const resClientPutName = await fetch(`${API_URL}/devices/${hdfcDevice._id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clientToken}` 
    },
    body: JSON.stringify({ name: 'Hacked Name Router', status: 'Active' })
  });
  // Since they sent status: Active and name: Hacked, backend should reject name updates and status shouldn't change
  logResult('Test 5: Client PUT name update check', 403, resClientPutName.status, resClientPutName.status === 403);

  // --- Test 6: Client PUT - Report Issue (Allowed)
  const resClientReport = await fetch(`${API_URL}/devices/${hdfcDevice._id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clientToken}` 
    },
    body: JSON.stringify({ status: 'Broken' })
  });
  const updatedByClient = await resClientReport.json();
  const reportSuccess = resClientReport.ok && updatedByClient.status === 'Broken';
  logResult('Test 6: Client PUT Report Issue (Allowed)', 200, resClientReport.status, reportSuccess);

  // --- Test 7: Technician GET (Allowed, sees all)
  const resTechGet = await fetch(`${API_URL}/devices`, {
    headers: { 'Authorization': `Bearer ${techToken}` }
  });
  const techDevices = await resTechGet.json();
  const techClients = techDevices.map(d => d.client);
  const techSeesAll = techClients.includes('HDFC') && techClients.includes('Cisco');
  logResult('Test 7: Technician GET (All Visibility)', 'Sees All', techSeesAll ? 'Sees All' : 'Partial', techSeesAll);

  // --- Test 8: Technician POST (Allowed)
  const resTechPost = await fetch(`${API_URL}/devices`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${techToken}` 
    },
    body: JSON.stringify({ name: 'Tech Router', type: 'Router', client: 'AuditCorp', status: 'Active' })
  });
  const createdByTech = await resTechPost.json();
  logResult('Test 8: Technician POST /devices (Allowed)', 201, resTechPost.status, resTechPost.status === 201);

  // --- Test 9: Technician DELETE Attempt (Banned)
  const resTechDelete = await fetch(`${API_URL}/devices/${hdfcDevice._id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${techToken}` }
  });
  logResult('Test 9: Technician DELETE /devices/:id (Forbidden)', 403, resTechDelete.status, resTechDelete.status === 403);

  // --- Test 10: Admin DELETE (Allowed)
  const resAdminDelete = await fetch(`${API_URL}/devices/${hdfcDevice._id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  logResult('Test 10: Admin DELETE /devices/:id (Allowed)', 200, resAdminDelete.status, resAdminDelete.status === 200);


  // 4. CLEAN UP DATABASE
  console.log('\n[4] Cleaning up audit records...');
  await User.deleteMany({ username: { $in: ['audit-admin', 'audit-tech', 'audit-client'] } });
  await Device.deleteMany({ _id: { $in: [hdfcDevice._id, ciscoDevice._id] } });
  if (createdByTech && createdByTech._id) {
    await Device.findByIdAndDelete(createdByTech._id);
  }
  console.log('Cleanup complete.');

  // 5. PRINT RESULTS TABLE
  console.log('\n========================================================================');
  console.log('                         AUDIT RESULTS SUMMARY                          ');
  console.log('========================================================================');
  console.table(results);
  console.log('========================================================================');

  mongoose.connection.close();
}

runSecurityAudit();
