import express from 'express';
import {
  createOrder,
  verifyOrderPayment,
  getMyOrders,
  getOrderById,
  cancelOrder
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

router.post('/', createOrder);
router.post('/verify-payment', verifyOrderPayment);
router.get('/', getMyOrders);
router.get('/:orderId', getOrderById);
router.put('/:orderId/cancel', cancelOrder);

export default router;
