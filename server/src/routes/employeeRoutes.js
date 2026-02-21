import express from 'express';
import {
  getShowroomBookings,
  inspectCar,
  generateInvoice,
  generateDirectInvoice,
  updateInvoice,
  updateBookingStatus,
  getEmployeeDashboard,
  getEmployeeInvoices,
  getBookingDetailsForEmployee,
  getShowroomPendingPayments,
  markPaymentAsPaidByEmployee,
  getEmployeeProfile,
  updateEmployeeProfile
} from '../controllers/employeeController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication and EMPLOYEE role
router.use(authMiddleware);
router.use(roleMiddleware('EMPLOYEE'));

// Booking routes
router.get('/showrooms/:showroomId/bookings', getShowroomBookings);
router.get('/bookings/:bookingId', getBookingDetailsForEmployee);
router.put('/bookings/:bookingId/inspect', inspectCar);
router.put('/bookings/:bookingId/status', updateBookingStatus);

// Profile routes
router.get('/profile', getEmployeeProfile);
router.put('/profile', updateEmployeeProfile);

// Invoice routes
router.post('/bookings/:bookingId/invoice/generate', generateInvoice);
router.post('/invoice/generate-direct', generateDirectInvoice);
router.put('/invoices/:invoiceId', updateInvoice);
router.get('/invoices', getEmployeeInvoices);

// Payment routes
router.get('/payments/pending', getShowroomPendingPayments);
router.put('/payments/:paymentId/mark-paid', markPaymentAsPaidByEmployee);

// Dashboard
router.get('/dashboard', getEmployeeDashboard);

export default router;
