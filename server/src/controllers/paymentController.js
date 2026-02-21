import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import Booking from '../models/Booking.js';
import PaymentAudit from '../models/PaymentAudit.js';
import { BOOKING_STATUS } from '../config/constants.js';
import { generateReceiptHTML } from '../utils/receiptGenerator.js';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

const ensureReceiptsDir = () => {
  const dir = path.join(process.cwd(), 'receipts');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  return dir;
};

// Record a manual/cash payment
export const recordCashPayment = async (req, res) => {
  try {
    const { invoiceId, amount, note } = req.body;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    if (!invoiceId) {
      return res.status(400).json({ message: 'invoiceId is required' });
    }

    // Validate that invoiceId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ message: 'Invalid invoiceId format' });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Permission: user can record only their own invoice; employees/admins can record any
    if (requesterRole === 'USER' && invoice.userId.toString() !== requesterId) {
      return res.status(403).json({ message: 'Not authorized to record payment for this invoice' });
    }

    const payAmount = amount !== undefined && amount !== null ? Number(amount) : Number(invoice.totalAmount || 0);

    const payment = await Payment.create({
      invoiceId: invoice._id,
      bookingId: invoice.bookingId,
      userId: invoice.userId,
      showroomId: invoice.showroomId,
      amount: payAmount,
      paymentMethod: 'CASH',
      razorpayOrderId: null,
      razorpayPaymentId: null,
      razorpaySignature: null,
      transactionId: `CASH-${Date.now()}`,
      status: 'SUCCESS',
      paymentDate: new Date(),
      failureReason: note || null
    });
    // Generate receipt PDF
    try {
      const receiptsDir = ensureReceiptsDir();
      const user = await (await import('../models/User.js')).default.findById(invoice.userId);
      const showroom = await (await import('../models/Showroom.js')).default.findById(invoice.showroomId);

      const html = generateReceiptHTML({ payment, invoice, user, showroom });
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const fileName = `RCPT-${payment.transactionId}.pdf`;
      const filePath = path.join(receiptsDir, fileName);
      await page.pdf({ path: filePath, format: 'A4', margin: { top: '10mm', bottom: '10mm' } });
      await browser.close();

      payment.receiptUrl = `/receipts/${fileName}`;
      await payment.save();

      // Save audit log
      await PaymentAudit.create({
        paymentId: payment._id,
        invoiceId: invoice._id,
        action: 'RECORD_CASH_PAYMENT',
        actorId: req.user.id,
        actorRole: req.user.role,
        details: { amount: payment.amount, note },
        ip: req.ip
      });

      // Update invoice and booking
      invoice.status = 'PAID';
      await invoice.save();

      if (invoice.bookingId) {
        await Booking.findByIdAndUpdate(invoice.bookingId, { status: BOOKING_STATUS.PAID });
      }

      res.status(201).json({ message: 'Cash payment recorded successfully', payment });
    } catch (pdfErr) {
      // Even if PDF generation fails, return success for payment creation
      await PaymentAudit.create({
        paymentId: payment._id,
        invoiceId: invoice._id,
        action: 'RECORD_CASH_PAYMENT_NO_PDF',
        actorId: req.user.id,
        actorRole: req.user.role,
        details: { amount: payment.amount, note, error: pdfErr.message },
        ip: req.ip
      });

      // Update invoice and booking
      invoice.status = 'PAID';
      await invoice.save();

      if (invoice.bookingId) {
        await Booking.findByIdAndUpdate(invoice.bookingId, { status: BOOKING_STATUS.PAID });
      }

      res.status(201).json({ message: 'Cash payment recorded, but receipt generation failed', payment, error: pdfErr.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { recordCashPayment };
