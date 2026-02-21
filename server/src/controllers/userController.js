import Booking from '../models/Booking.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import Showroom from '../models/Showroom.js';
import User from '../models/User.js';
import { BOOKING_STATUS, PARKING_RATES } from '../config/constants.js';
import { calculateDistance } from '../utils/distance.js';
import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';

export const searchNearbyShowrooms = async (req, res) => {
  try {
    const { lat, lng, radiusKm = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Please provide latitude and longitude' });
    }

    const showrooms = await Showroom.find({ isActive: true });

    const nearbyShowrooms = showrooms
      .map(showroom => ({
        ...showroom.toObject(),
        distance: calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          showroom.location.coordinates[1],
          showroom.location.coordinates[0]
        )
      }))
      .filter(s => s.distance <= parseFloat(radiusKm))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      message: 'Nearby showrooms fetched successfully',
      count: nearbyShowrooms.length,
      showrooms: nearbyShowrooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchShowroomsByCity = async (req, res) => {
  try {
    const { city, radiusKm = 10 } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'Please provide a city name' });
    }

    // Search showrooms by city (case-insensitive)
    const showrooms = await Showroom.find({
      isActive: true,
      city: new RegExp(city, 'i')
    });

    if (showrooms.length === 0) {
      return res.status(200).json({
        message: 'No showrooms found in this city',
        count: 0,
        showrooms: []
      });
    }

    // For city-based search, we can't calculate distance without user coordinates
    // So just return showrooms sorted by name
    const sortedShowrooms = showrooms.sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json({
      message: 'Showrooms in city fetched successfully',
      count: sortedShowrooms.length,
      showrooms: sortedShowrooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bookService = async (req, res) => {
  try {
    const userId = req.user.id;
    const { showroomId, serviceType, duration, carDetails, description, durationStartDate, durationEndDate } = req.body;

    if (!showroomId || !serviceType || !carDetails) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check showroom exists
    const showroom = await Showroom.findById(showroomId);
    if (!showroom) {
      return res.status(404).json({ message: 'Showroom not found' });
    }

    // Calculate estimated cost
    const rates = {
      HOURLY: PARKING_RATES.HOURLY,
      DAILY: PARKING_RATES.DAILY,
      WEEKLY: PARKING_RATES.WEEKLY
    };
    const estimatedCost = rates[duration] || PARKING_RATES.HOURLY;

    const booking = await Booking.create({
      userId,
      showroomId,
      serviceType,
      duration,
      carDetails,
      description,
      estimatedCost,
      durationStartDate,
      durationEndDate,
      status: BOOKING_STATUS.PENDING
    });

    await booking.populate('showroomId userId');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ userId })
      .populate('showroomId', 'name address city location')
      .sort('-createdAt');

    res.status(200).json({
      message: 'Bookings fetched successfully',
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId)
      .populate('showroomId', 'name address city phoneNumber location')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this booking' });
    }

    const invoice = await Invoice.findOne({ bookingId });

    res.status(200).json({
      message: 'Booking details fetched successfully',
      booking,
      invoice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user.id;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    invoice.status = 'ACCEPTED';
    invoice.acceptedDate = new Date();
    await invoice.save();

    // Update booking status
    await Booking.findByIdAndUpdate(invoice.bookingId, {
      status: BOOKING_STATUS.INVOICED
    });

    res.status(200).json({
      message: 'Invoice accepted successfully',
      invoice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPaymentOrder = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(invoice.totalAmount * 100), // Convert to smallest currency unit
      currency: 'INR',
      receipt: invoice.invoiceNumber,
      notes: {
        invoiceId: invoice._id.toString(),
        bookingId: invoice.bookingId.toString()
      }
    });

    // Create payment record
    const payment = await Payment.create({
      invoiceId,
      bookingId: invoice.bookingId,
      userId: invoice.userId,
      showroomId: invoice.showroomId,
      amount: invoice.totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: 'PENDING'
    });

    res.status(201).json({
      message: 'Payment order created successfully',
      razorpayOrderId: razorpayOrder.id,
      amount: invoice.totalAmount,
      paymentId: payment._id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

    // Verify signature
    const sign = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(paymentId, {
      razorpayPaymentId,
      razorpaySignature,
      status: 'SUCCESS',
      paymentDate: new Date(),
      transactionId: razorpayPaymentId
    }, { new: true });

    // Update invoice status
    await Invoice.findByIdAndUpdate(payment.invoiceId, {
      status: 'PAID'
    });

    // Update booking status
    await Booking.findByIdAndUpdate(payment.bookingId, {
      status: BOOKING_STATUS.PAID
    });

    res.status(200).json({
      message: 'Payment verified successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyInvoices = async (req, res) => {
  try {
    const userId = req.user.id;

    const invoices = await Invoice.find({ userId })
      .populate('bookingId', 'serviceType duration carDetails')
      .populate('showroomId', 'name address')
      .sort('-createdAt');

    res.status(200).json({
      message: 'Invoices fetched successfully',
      count: invoices.length,
      invoices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const userId = req.user.id;

    const invoice = await Invoice.findById(invoiceId)
      .populate('bookingId', 'serviceType duration carDetails')
      .populate('showroomId', 'name address');

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Ensure user can access: user must be owner or have employee/admin role
    if (req.user.role === 'USER' && invoice.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this invoice' });
    }

    // Find payments for this invoice
    const Payment = (await import('../models/Payment.js')).default;
    const payments = await Payment.find({ invoiceId: invoice._id }).sort('-createdAt');

    res.status(200).json({ message: 'Invoice fetched', invoice, payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Profile Management
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .populate('showroomId', 'name address city');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile fetched successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, profileImage } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending payments for user
export const getPendingPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const pendingPayments = await Payment.find({ 
      userId,
      status: 'PENDING'
    })
      .populate('invoiceId', 'invoiceNumber totalAmount')
      .populate('bookingId', 'serviceType carDetails')
      .populate('showroomId', 'name address')
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

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({ userId })
      .populate('invoiceId', 'invoiceNumber totalAmount')
      .populate('bookingId', 'serviceType carDetails')
      .populate('showroomId', 'name address')
      .sort('-createdAt');

    res.status(200).json({
      message: 'Payment history fetched successfully',
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment details by ID
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findById(paymentId)
      .populate('invoiceId')
      .populate('bookingId')
      .populate('showroomId', 'name address');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this payment' });
    }

    res.status(200).json({
      message: 'Payment details fetched successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
