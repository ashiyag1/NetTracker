import express from 'express';
const router = express.Router();
import Device from '../models/Device.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// GET all devices (Protected & Role-Filtered)
router.get('/', protect, authorize('admin', 'technician', 'client'), async (req, res) => {
    try {
        let queryFilter = {};

        // If the logged-in user is a Client, they can ONLY see their own company's devices (case-insensitive)
        if (req.user.role === 'client') {
            queryFilter = { client: { $regex: new RegExp(`^${req.user.clientCompany}$`, 'i') } }; 
        }

        // Query the database using our filter
        const devices = await Device.find(queryFilter);
        res.json(devices);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

import User from '../models/User.js';

// GET all unique clients (Public)
// Used by the frontend Login screen to populate registration dropdowns
router.get('/clients', async (req, res) => {
    try {
        // Fetch unique clients from both Devices and Users (so empty companies aren't missing)
        const deviceClients = await Device.distinct('client');
        const userClients = await User.distinct('clientCompany');
        
        // Merge and deduplicate
        const allClients = [...new Set([...deviceClients, ...userClients])];
        
        // Filter out any empty strings or nulls, and sort alphabetically
        const cleanClients = allClients.filter(c => c && c.trim() !== '').sort();
        res.json(cleanClients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/',protect, authorize('admin', 'technician'), async(req,res)=>{
    const device= new Device({
        name: req.body.name,
        type: req.body.type,
        client: req.body.client,
        status: req.body.status, // Map status from request body
        serialNumber: req.body.serialNumber,
        location: req.body.location,
        warrantyExpiry: req.body.warrantyExpiry
    });
    try{
        const newDevice =await device.save(); //save to database krdo
        res.status(201).json(newDevice); //201 means created succesfully
    } catch(error){
        res.status(400).json({message:error.message}); 
        //400 yaani bad request
    }
});

//update a device (PUT)
//URL:http://localhost:5000/api/devices/:id

router.put('/:id', protect, authorize('admin', 'technician', 'client'), async (req, res) => {
    try {
        let updateData = req.body;

        // Security: Clients can only report issues (setting status to 'Broken')
        if (req.user.role === 'client') {
            if (req.body.status !== 'Broken') {
                return res.status(403).json({ message: 'Clients can only report issues (set status to Broken)' });
            }
            updateData = { status: 'Broken' }; // Sanitize payload to strip other fields
        }

        const updatedDevice = await Device.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }
        
        res.json(updatedDevice); // send the updated device back
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 6. DELETE a device (DELETE)
// URL: http://localhost:5000/api/devices/:id
router.delete('/:id', protect,authorize('admin'), async (req, res) => {
    try {
        const deletedDevice = await Device.findByIdAndDelete(req.params.id);
        if (!deletedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



export default router;

