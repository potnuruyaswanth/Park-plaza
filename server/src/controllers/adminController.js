import Showroom from '../models/Showroom.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import { USER_ROLES } from '../config/constants.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const buildVerificationLink = (token) => {
  const baseUrl = process.env.CLIENT_URL || process.env.APP_BASE_URL || 'http://localhost:5173';
  return `${baseUrl}/verify-email?token=${token}`;
};

const getEmailTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email service is not configured');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendEmployeeWelcomeEmail = async (email, username, tempPassword, token) => {
  const transporter = getEmailTransporter();
  const link = buildVerificationLink(token);

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@parkplaza.local',
    to: email,
    subject: 'Your Park Plaza employee account',
    text: `Your employee account is ready. Username: ${username} Password: ${tempPassword} Verify: ${link}`,
    html: `<p>Your employee account is ready.</p><p><strong>Username:</strong> ${username}<br /><strong>Temporary password:</strong> ${tempPassword}</p><p>Please verify your email to activate login:</p><p><a href="${link}">${link}</a></p>`
  });
};

const createEmailVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) };
};

const generateTempPassword = () => `PP-EMP-${crypto.randomInt(100000, 999999)}`;

const generateUsernameFromName = (name) => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12) || 'employee';
  return `${base}${crypto.randomInt(100, 999)}`;
};

export const createShowroom = async (req, res) => {
  try {
    const { name, address, city, latitude, longitude, totalParkingSlots, facilities, phoneNumber, operatingHours } = req.body;

    if (!name || !address || !city || latitude === undefined || longitude === undefined || !totalParkingSlots) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const showroom = await Showroom.create({
      name,
      address,
      city,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      totalParkingSlots,
      availableSlots: totalParkingSlots,
      facilities: facilities || [],
      phoneNumber,
      operatingHours
    });

    res.status(201).json({
      message: 'Showroom created successfully',
      showroom
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShowroom = async (req, res) => {
  try {
    const { showroomId } = req.params;
    const updateData = req.body;

    if (updateData.latitude && updateData.longitude) {
      updateData.location = {
        type: 'Point',
        coordinates: [updateData.longitude, updateData.latitude]
      };
      delete updateData.latitude;
      delete updateData.longitude;
    }

    const showroom = await Showroom.findByIdAndUpdate(
      showroomId,
      updateData,
      { new: true }
    );

    if (!showroom) {
      return res.status(404).json({ message: 'Showroom not found' });
    }

    res.status(200).json({
      message: 'Showroom updated successfully',
      showroom
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllShowrooms = async (req, res) => {
  try {
    const showrooms = await Showroom.find({ isActive: true });

    res.status(200).json({
      message: 'Showrooms fetched successfully',
      count: showrooms.length,
      showrooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, showroomId, username } = req.body;

    if (!name || !email || !phone || !showroomId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!/^[A-Z0-9._%+-]+@gmail\.com$/i.test(email)) {
      return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
    }

    // Check if showroom exists
    const showroom = await Showroom.findById(showroomId);
    if (!showroom) {
      return res.status(404).json({ message: 'Showroom not found' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    let assignedUsername = username?.toLowerCase();
    if (assignedUsername) {
      const existingUsername = await User.findOne({ username: assignedUsername });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    } else {
      let candidate = generateUsernameFromName(name);
      let exists = await User.findOne({ username: candidate });
      while (exists) {
        candidate = generateUsernameFromName(name);
        exists = await User.findOne({ username: candidate });
      }
      assignedUsername = candidate;
    }

    const tempPassword = generateTempPassword();
    const { rawToken, hashedToken, expires } = createEmailVerificationToken();

    const employee = await User.create({
      username: assignedUsername,
      name,
      email,
      phone,
      password: tempPassword,
      role: USER_ROLES.EMPLOYEE,
      showroomId,
      emailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expires
    });

    try {
      await sendEmployeeWelcomeEmail(employee.email, assignedUsername, tempPassword, rawToken);
    } catch (emailError) {
      await User.findByIdAndDelete(employee._id);
      return res.status(500).json({ message: emailError.message || 'Failed to send employee credentials' });
    }

    res.status(201).json({
      message: 'Employee created and credentials sent successfully',
      employee: employee.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeesByShowroom = async (req, res) => {
  try {
    const { showroomId } = req.params;

    const employees = await User.find({
      showroomId,
      role: USER_ROLES.EMPLOYEE
    });

    res.status(200).json({
      message: 'Employees fetched successfully',
      count: employees.length,
      employees
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const totalShowrooms = await Showroom.countDocuments();
    const totalEmployees = await User.countDocuments({ role: USER_ROLES.EMPLOYEE });
    const totalUsers = await User.countDocuments({ role: USER_ROLES.USER });
    const totalBookings = await Booking.countDocuments();
    
    const totalRevenue = await Invoice.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const topPerformingShowrooms = await Booking.aggregate([
      { $group: { _id: '$showroomId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'showrooms', localField: '_id', foreignField: '_id', as: 'showroom' } }
    ]);

    res.status(200).json({
      message: 'Dashboard data fetched successfully',
      dashboard: {
        totalShowrooms,
        totalEmployees,
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        topPerformingShowrooms
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShowroomStats = async (req, res) => {
  try {
    const { showroomId } = req.params;

    const showroom = await Showroom.findById(showroomId);
    if (!showroom) {
      return res.status(404).json({ message: 'Showroom not found' });
    }

    const totalBookings = await Booking.countDocuments({ showroomId });
    const completedBookings = await Booking.countDocuments({
      showroomId,
      status: 'COMPLETED'
    });
    const totalInvoices = await Invoice.countDocuments({ showroomId });
    const totalRevenue = await Invoice.aggregate([
      { $match: { showroomId: showroom._id } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const employees = await User.countDocuments({
      showroomId,
      role: USER_ROLES.EMPLOYEE
    });

    res.status(200).json({
      message: 'Showroom stats fetched successfully',
      stats: {
        showroomName: showroom.name,
        totalBookings,
        completedBookings,
        totalInvoices,
        totalRevenue: totalRevenue[0]?.total || 0,
        employees,
        averageRating: showroom.rating
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create invoice for a user (Admin/Employee only)
export const createUserInvoice = async (req, res) => {
  try {
    const { userId, showroomId, bookingId, itemsDescription, partsCost, laborCost, tax, discount, notes } = req.body;
    const employeeId = req.user.id;

    // Validation
    if (!userId || !showroomId || !itemsDescription || !Array.isArray(itemsDescription)) {
      return res.status(400).json({ message: 'Please provide userId, showroomId, and itemsDescription' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if showroom exists
    const showroom = await Showroom.findById(showroomId);
    if (!showroom) {
      return res.status(404).json({ message: 'Showroom not found' });
    }

    // Calculate total amount
    const totalAmount = (partsCost || 0) + (laborCost || 0) + (tax || 0) - (discount || 0);

    // Create invoice
    const invoice = await Invoice.create({
      bookingId: bookingId || null,
      userId,
      employeeId,
      showroomId,
      itemsDescription,
      partsCost: partsCost || 0,
      laborCost: laborCost || 0,
      tax: tax || 0,
      discount: discount || 0,
      totalAmount,
      status: 'GENERATED',
      notes
    });

    // If booking exists, update its status
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { status: 'INVOICED' });
    }

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending payments
export const getAllPendingPayments = async (req, res) => {
  try {
    const { showroomId } = req.query;
    
    const query = { status: 'PENDING' };
    if (showroomId) {
      query.showroomId = showroomId;
    }

    const pendingPayments = await Payment.find(query)
      .populate('userId', 'username name email phone')
      .populate('showroomId', 'name address')
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

// Mark payment as paid (for cash payments)
export const markPaymentAsPaid = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const employeeId = req.user.id;

    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
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
      notes: 'Cash payment received and marked as paid by admin/employee'
    });

    res.status(200).json({
      message: 'Payment marked as paid successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment history for admin
export const getPaymentHistory = async (req, res) => {
  try {
    const { showroomId, status, startDate, endDate } = req.query;
    
    const query = {};
    
    if (showroomId) {
      query.showroomId = showroomId;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('userId', 'username name email phone')
      .populate('showroomId', 'name address')
      .populate('invoiceId', 'invoiceNumber totalAmount')
      .populate('bookingId', 'serviceType carDetails')
      .sort('-createdAt');

    const totalRevenue = payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      message: 'Payment history fetched successfully',
      count: payments.length,
      totalRevenue,
      payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get users for admin role management
export const getUsers = async (req, res) => {
  try {
    const { search = '', role } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { username: regex },
        { email: regex },
        { name: regex }
      ];
    }

    const users = await User.find(query)
      .select('username name email role showroomId')
      .populate('showroomId', 'name city')
      .sort('-createdAt')
      .limit(50);

    res.status(200).json({
      message: 'Users fetched successfully',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, showroomId } = req.body;

    if (!role || !Object.values(USER_ROLES).includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const update = { role };

    if (role === USER_ROLES.EMPLOYEE) {
      if (!showroomId) {
        return res.status(400).json({ message: 'showroomId is required for employee role' });
      }
      const showroom = await Showroom.findById(showroomId);
      if (!showroom) {
        return res.status(404).json({ message: 'Showroom not found' });
      }
      update.showroomId = showroomId;
    } else {
      update.showroomId = null;
    }

    const user = await User.findByIdAndUpdate(userId, update, { new: true })
      .select('username name email role showroomId')
      .populate('showroomId', 'name city');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
