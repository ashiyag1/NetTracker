import express from 'express';
import { checkWarranties } from '../controllers/cronController.js';

const router = express.Router();

router.get('/warranty-check', checkWarranties);

export default router;