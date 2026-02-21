import express from 'express';
import {
  searchNearbyShowrooms,
  searchShowroomsByCity,
  bookService,
  getMyBookings,
  getBookingDetails,
  acceptInvoice,
  createPaymentOrder,
  verifyPayment,
  getMyInvoices,
  getInvoiceById,
  getProfile,
  updateProfile,
  getPendingPayments,
  getPaymentHistory,
  getPaymentById
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);
router.use(roleMiddleware('USER'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Showroom routes
router.get('/showrooms/nearby', searchNearbyShowrooms);
router.get('/showrooms/city', searchShowroomsByCity);

// Booking routes
router.post('/bookings', bookService);
router.get('/bookings', getMyBookings);
router.get('/bookings/:bookingId', getBookingDetails);

// Invoice routes
router.get('/invoices', getMyInvoices);
router.post('/invoices/:invoiceId/accept', acceptInvoice);
router.get('/invoices/:invoiceId', getInvoiceById);

// Payment routes
router.get('/payments/pending', getPendingPayments);
router.get('/payments/history', getPaymentHistory);
router.get('/payments/:paymentId', getPaymentById);
router.post('/payments/:invoiceId/order', createPaymentOrder);
router.post('/payments/verify', verifyPayment);

export default router;
