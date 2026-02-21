import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { recordCashPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Require authentication but allow users, employees, and admins.
router.use(authMiddleware);

// Record a manual cash payment
router.post('/manual', recordCashPayment);

export default router;
