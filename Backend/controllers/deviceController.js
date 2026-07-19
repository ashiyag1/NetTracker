import Device from '../models/Device.js';
import User from '../models/User.js';

// @desc    Get all devices (Role-Filtered)
// @route   GET /api/devices
export const getDevices = async (req, res) => {
    try {
        let queryFilter = {};

        // If the logged-in user is a Client, they can ONLY see their own company's devices (case-insensitive)
        if (req.user.role === 'client') {
            queryFilter = { client: { $regex: new RegExp(`^${req.user.clientCompany}$`, 'i') } }; 
        }

        const devices = await Device.find(queryFilter);
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all unique client companies
// @route   GET /api/devices/clients
export const getUniqueClients = async (req, res) => {
    try {
        const deviceClients = await Device.distinct('client');
        const userClients = await User.distinct('clientCompany');
        
        const allClients = [...new Set([...deviceClients, ...userClients])];
        const cleanClients = allClients.filter(c => c && c.trim() !== '').sort();
        
        res.json(cleanClients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all unique device names for dropdowns
// @route   GET /api/devices/names
export const getUniqueDeviceNames = async (req, res) => {
    try {
        const names = await Device.distinct('name');
        const cleanNames = names.filter(n => n && n.trim() !== '').sort();
        res.json(cleanNames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new device
// @route   POST /api/devices
export const addDevice = async (req, res) => {
    const device = new Device({
        name: req.body.name,
        type: req.body.type,
        client: req.body.client,
        status: req.body.status,
        serialNumber: req.body.serialNumber,
        location: req.body.location,
        warrantyExpiry: req.body.warrantyExpiry
    });

    try {
        const newDevice = await device.save();
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a device
// @route   PUT /api/devices/:id
export const updateDevice = async (req, res) => {
    try {
        let updateData = req.body;

        // Security: Clients can only report issues
        if (req.user.role === 'client') {
            if (req.body.status !== 'Broken') {
                return res.status(403).json({ message: 'Clients can only report issues' });
            }
            updateData = { status: 'Broken' };
        }

        const updatedDevice = await Device.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }
        
        res.json(updatedDevice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a device
// @route   DELETE /api/devices/:id
export const deleteDevice = async (req, res) => {
    try {
        const deletedDevice = await Device.findByIdAndDelete(req.params.id);
        if (!deletedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
