import express from 'express';
import {
  createShowroom,
  updateShowroom,
  getAllShowrooms,
  createEmployee,
  getEmployeesByShowroom,
  getAdminDashboard,
  getShowroomStats,
  createUserInvoice,
  getAllPendingPayments,
  markPaymentAsPaid,
  getPaymentHistory,
  getUsers,
  updateUserRole
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication and ADMIN role
router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

// Showroom routes
router.post('/showrooms', createShowroom);
router.get('/showrooms', getAllShowrooms);
router.put('/showrooms/:showroomId', updateShowroom);
router.get('/showrooms/:showroomId/stats', getShowroomStats);

// Employee routes
router.post('/employees', createEmployee);
router.get('/showrooms/:showroomId/employees', getEmployeesByShowroom);

// User role management
router.get('/users', getUsers);
router.put('/users/:userId/role', updateUserRole);

// Invoice routes
router.post('/invoices', createUserInvoice);

// Payment routes
router.get('/payments/pending', getAllPendingPayments);
router.get('/payments/history', getPaymentHistory);
router.put('/payments/:paymentId/mark-paid', markPaymentAsPaid);

// Dashboard
router.get('/dashboard', getAdminDashboard);

export default router;
