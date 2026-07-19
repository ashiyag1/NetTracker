import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Device from './models/Device.js'; 

// Force Google DNS to bypass local ISP / Windows SRV blocking issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const companies = ['HDFC Bank', 'Cisco Systems', 'TechCorp Inc', 'MVD Headquarters', 'Google India', 'Microsoft APAC'];
const deviceNames = ['Cisco Catalyst 9300', 'Dell PowerEdge R740', 'Cisco IP Phone 8841', 'Polycom RealPresence', 'Fortinet FortiGate 100F', 'Aruba 515 Access Point'];
const types = ['Router', 'Switch', 'IP Phone', 'AVEquipment', 'Other'];
const statuses = ['Active', 'Active', 'Active', 'Active', 'Broken', 'Under Maintenance']; 
const locations = ['Server Room A', 'Floor 2 Rack', 'Lobby Desk', 'Remote Office Branch', 'Data Center B'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateDevices = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected! Wiping old data...');

    await Device.deleteMany({});
    
    console.log('Generating 10,000 realistic devices...');
    const devicesToInsert = [];
    
    for (let i = 0; i < 10000; i++) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 1000) - 180);

      devicesToInsert.push({
        name: getRandom(deviceNames),
        type: getRandom(types),
        client: getRandom(companies),
        status: getRandom(statuses),
        location: getRandom(locations),
        serialNumber: `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        warrantyExpiry: expiryDate
      });
    }

    // Insert all 10,000 into MongoDB in one bulk operation
    await Device.insertMany(devicesToInsert);
    
    console.log('✅ Successfully seeded 10,000 devices into the database!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

generateDevices();
