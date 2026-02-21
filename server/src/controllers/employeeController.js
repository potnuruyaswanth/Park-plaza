import Booking from '../models/Booking.js';
import Invoice from '../models/Invoice.js';
import Showroom from '../models/Showroom.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { BOOKING_STATUS, INVOICE_STATUS, SERVICE_TYPE } from '../config/constants.js';
import { generateInvoiceHTML } from '../utils/invoiceGenerator.js';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getShowroomBookings = async (req, res) => {
  try {
    const { showroomId } = req.params;
    const employeeId = req.user.id;

    // Check if employee belongs to this showroom
    const employee = await User.findById(employeeId);
    if (employee.showroomId.toString() !== showroomId) {
      return res.status(403).json({ message: 'Not authorized to access this showroom' });
    }

    const bookings = await Booking.find({
      showroomId,
      status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.INSPECTED] }
    })
      .populate('userId', 'name email phone')
      .populate('showroomId', 'name address')
      .sort('-bookingDate');

    res.status(200).json({
      message: 'Bookings fetched successfully',
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const inspectCar = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { notes } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: BOOKING_STATUS.INSPECTED,
        notes
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Car inspection completed',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateInvoice = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const employeeId = req.user.id;
    const { itemsDescription, partsCost, laborCost, tax, discount, notes } = req.body;

    if (!itemsDescription || !Array.isArray(itemsDescription)) {
      return res.status(400).json({ message: 'Please provide items description' });
    }

    const booking = await Booking.findById(bookingId).populate('userId showroomId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const totalAmount = partsCost + laborCost + tax - (discount || 0);

    const invoice = await Invoice.create({
      bookingId,
      userId: booking.userId._id,
      employeeId,
      showroomId: booking.showroomId._id,
      itemsDescription,
      partsCost,
      laborCost,
      tax: tax || 0,
      discount: discount || 0,
      totalAmount,
      status: INVOICE_STATUS.GENERATED,
      notes
    });

    // Update booking status
    await Booking.findByIdAndUpdate(bookingId, {
      status: BOOKING_STATUS.INVOICED
    });

    // Generate PDF
    try {
      const user = await User.findById(booking.userId._id);
      const showroom = await Showroom.findById(booking.showroomId._id);
      const employee = await User.findById(employeeId);

      const htmlContent = generateInvoiceHTML(invoice, booking, user, showroom, employee);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent);

      const pdfPath = path.join(__dirname, `../../invoices/${invoice.invoiceNumber}.pdf`);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: { top: 10, right: 10, bottom: 10, left: 10 }
      });

      await browser.close();

      invoice.pdfUrl = `/invoices/${invoice.invoiceNumber}.pdf`;
      await invoice.save();
    } catch (pdfError) {
      console.log('PDF generation failed:', pdfError.message);
      // Continue without PDF
    }

    await invoice.populate('userId employeeId showroomId bookingId');

    res.status(201).json({
      message: 'Invoice generated successfully',
      invoice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { itemsDescription, partsCost, laborCost, tax, discount, notes } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status !== INVOICE_STATUS.GENERATED) {
      return res.status(400).json({ message: 'Cannot update invoice that is already accepted or paid' });
    }

    invoice.itemsDescription = itemsDescription || invoice.itemsDescription;
    invoice.partsCost = partsCost || invoice.partsCost;
    invoice.laborCost = laborCost || invoice.laborCost;
    invoice.tax = tax !== undefined ? tax : invoice.tax;
    invoice.discount = discount !== undefined ? discount : invoice.discount;
    invoice.notes = notes || invoice.notes;
    invoice.totalAmount = invoice.partsCost + invoice.laborCost + invoice.tax - invoice.discount;

    await invoice.save();

    res.status(200).json({
      message: 'Invoice updated successfully',
      invoice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!Object.values(BOOKING_STATUS).includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeDashboard = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const employee = await User.findById(employeeId);

    if (!employee.showroomId) {
      return res.status(400).json({ message: 'Employee not assigned to any showroom' });
    }

    // Count only records that have a payment created (successful invoice generation)
    const totalBookings = await Payment.countDocuments({ showroomId: employee.showroomId });
    const pendingBookings = await Payment.countDocuments({
      showroomId: employee.showroomId,
      status: 'PENDING'
    });
    const completedBookings = await Payment.countDocuments({
      showroomId: employee.showroomId,
      status: 'SUCCESS'
    });

    const totalInvoicesGenerated = await Payment.countDocuments({ showroomId: employee.showroomId });
    const totalRevenue = await Payment.aggregate([
      { $match: { showroomId: employee.showroomId, status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      message: 'Dashboard data fetched successfully',
      dashboard: {
        totalBookings,
        pendingBookings,
        completedBookings,
        totalInvoicesGenerated,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeInvoices = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const invoices = await Invoice.find({ employeeId })
      .populate('bookingId', 'serviceType duration')
      .populate('showroomId', 'name address')
      .sort('-createdAt');

    res.status(200).json({ message: 'Invoices fetched', count: invoices.length, invoices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const employee = await User.findById(employeeId)
      .populate('showroomId', 'name address city');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Profile fetched successfully',
      user: employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { name, phone, address, profileImage } = req.body;

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (name) employee.name = name;
    if (phone) employee.phone = phone;
    if (address) employee.address = address;
    if (profileImage) employee.profileImage = profileImage;

    await employee.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingDetailsForEmployee = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const employeeId = req.user.id;

    const booking = await Booking.findById(bookingId)
      .populate('userId', 'name email phone')
      .populate('showroomId', 'name address');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Ensure employee belongs to showroom
    const employee = await User.findById(employeeId);
    if (!employee || !employee.showroomId || employee.showroomId.toString() !== booking.showroomId._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.status(200).json({ message: 'Booking fetched', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending payments for employee's showroom
export const getShowroomPendingPayments = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const employee = await User.findById(employeeId);

    if (!employee.showroomId) {
      return res.status(400).json({ message: 'Employee not assigned to any showroom' });
    }

    const pendingPayments = await Payment.find({
      showroomId: employee.showroomId,
      status: 'PENDING'
    })
      .populate('userId', 'username name email phone')
      .populate('invoiceId', 'invoiceNumber totalAmount')
      .populate('bookingId', 'serviceType carDetails')
      .sort('-createdAt');

    res.status(200).json({
      message: 'Pending payments fetched successfully',
      count: pendingPayments.length,
      payments: pendingPayments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark payment as paid for employee
export const markPaymentAsPaidByEmployee = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const employeeId = req.user.id;
    const employee = await User.findById(employeeId);

    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if payment belongs to employee's showroom
    if (payment.showroomId.toString() !== employee.showroomId.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this payment' });
    }

    if (payment.status !== 'PENDING') {
      return res.status(400).json({ message: 'Payment is not pending' });
    }

    // Update payment
    payment.status = 'SUCCESS';
    payment.paymentMethod = 'CASH';
    payment.paymentDate = new Date();
    payment.transactionId = `CASH_${Date.now()}_${payment._id}`;
    await payment.save();

    // Update invoice status
    await Invoice.findByIdAndUpdate(payment.invoiceId, {
      status: 'PAID'
    });

    // Update booking status
    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: 'PAID'
    });

    // Create payment audit record
    const PaymentAudit = (await import('../models/PaymentAudit.js')).default;
    await PaymentAudit.create({
      paymentId: payment._id,
      employeeId,
      action: 'MARK_AS_PAID',
      previousStatus: 'PENDING',
      newStatus: 'SUCCESS',
      notes: 'Cash payment received and marked as paid by employee'
    });

    res.status(200).json({
      message: 'Payment marked as paid successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate invoice directly without booking (for walk-in repairs)
export const generateDirectInvoice = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { username, repairDescription, repairCost, carDetails, notes } = req.body;

    console.log('=== Generate Direct Invoice Request ===');
    console.log('Employee ID:', employeeId);
    console.log('Username:', username);
    console.log('Repair Description:', repairDescription);
    console.log('Repair Cost:', repairCost);
    console.log('Car Details:', carDetails);

    // Validation
    if (!username || !repairDescription || !repairCost) {
      return res.status(400).json({ 
        message: 'Please provide username, repair description, and repair cost' 
      });
    }

    // Find user by username
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: `User with username '${username}' not found` });
    }
    console.log('User found:', user.username);

    // Get employee's showroom
    const employee = await User.findById(employeeId).populate('showroomId');
    if (!employee || !employee.showroomId) {
      return res.status(400).json({ message: 'Employee showroom not found' });
    }
    console.log('Employee showroom:', employee.showroomId.name);

    // Create a simple booking record for the repair
    const booking = await Booking.create({
      userId: user._id,
      showroomId: employee.showroomId._id,
      carDetails: {
        carNumber: carDetails?.carNumber || 'N/A',
        carModel: carDetails?.carModel || '',
        carColor: carDetails?.carColor || ''
      },
      serviceType: SERVICE_TYPE.REPAIR,
      description: repairDescription,
      estimatedCost: Number(repairCost),
      status: BOOKING_STATUS.INVOICED,
      bookingDate: new Date()
    });
    console.log('Booking created:', booking._id);

    // Generate invoice number manually
    const invoiceCount = await Invoice.countDocuments();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const invoiceNumber = `INV-${year}${month}-${String(invoiceCount + 1).padStart(5, '0')}`;
    console.log('Generated invoice number:', invoiceNumber);

    // Create invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      bookingId: booking._id,
      userId: user._id,
      employeeId,
      showroomId: employee.showroomId._id,
      itemsDescription: [
        {
          description: repairDescription,
          quantity: 1,
          unitPrice: Number(repairCost),
          amount: Number(repairCost)
        }
      ],
      partsCost: 0,
      laborCost: Number(repairCost),
      tax: 0,
      discount: 0,
      totalAmount: Number(repairCost),
      status: INVOICE_STATUS.GENERATED,
      notes: notes || `Direct invoice generated by employee for car repair`
    });
    console.log('Invoice created:', invoice.invoiceNumber);

    // Create pending payment (don't set paymentMethod for pending payments)
    const payment = await Payment.create({
      userId: user._id,
      invoiceId: invoice._id,
      bookingId: booking._id,
      showroomId: employee.showroomId._id,
      amount: Number(repairCost),
      status: 'PENDING'
      // paymentMethod will default to 'RAZORPAY' when payment is made
    });
    console.log('Payment created:', payment._id);

    // Populate the invoice for response
    await invoice.populate([
      { path: 'userId', select: 'name email phone username' },
      { path: 'showroomId', select: 'name address city' }
    ]);

    res.status(201).json({
      message: 'Invoice generated successfully',
      invoice,
      payment,
      booking
    });
  } catch (error) {
    console.error('=== Error in generateDirectInvoice ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};
