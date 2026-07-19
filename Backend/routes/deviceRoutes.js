import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
    getDevices, 
    getUniqueClients, 
    getUniqueDeviceNames,
    addDevice, 
    updateDevice, 
    deleteDevice 
} from '../controllers/deviceController.js';

const router = express.Router();

router.get('/', protect, authorize('admin', 'technician', 'client'), getDevices);
router.get('/clients', getUniqueClients);
router.get('/names', getUniqueDeviceNames);

router.post('/', protect, authorize('admin', 'technician'), addDevice);
router.put('/:id', protect, authorize('admin', 'technician', 'client'), updateDevice);
router.delete('/:id', protect, authorize('admin'), deleteDevice);

export default router;
