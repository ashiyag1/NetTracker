import express from 'express';
import Device from '../models/Device.js';

const router = express.Router();

// Cron Endpoint: GET /api/cron/warranty-check
router.get('/warranty-check', async (req, res) => {
    const authHeader = req.headers.authorization;
    
    // Security check: Only allow access if the request has Vercel's CRON_SECRET
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ message: 'Unauthorized: Cron Secret mismatch' });
    }

    try {
        const today = new Date();
        const in30Days = new Date();
        in30Days.setDate(today.getDate() + 30);

        // Find devices whose warranty expires between today and 30 days from now
        const expiringDevices = await Device.find({
            warrantyExpiry: {
                $gte: today,
                $lte: in30Days
            }
        });

        console.log(`[CRON] Warranty scanner completed. Found ${expiringDevices.length} expiring assets.`);

        // In a production server, you would use a mailer here:
        // await sendEmailAlert(expiringDevices);

        res.status(200).json({ 
            message: 'Warranty scan complete',
            expiringCount: expiringDevices.length,
            devices: expiringDevices.map(d => ({ name: d.name, client: d.client, expiry: d.warrantyExpiry }))
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;