import mongoose from 'mongoose';
import { INVOICE_STATUS } from '../config/constants.js';

const invoiceSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    showroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showroom',
      required: true
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: true
    },
    itemsDescription: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        amount: Number
      }
    ],
    partsCost: {
      type: Number,
      default: 0
    },
    laborCost: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(INVOICE_STATUS),
      default: INVOICE_STATUS.GENERATED
    },
    generatedDate: {
      type: Date,
      default: Date.now
    },
    acceptedDate: Date,
    dueDate: Date,
    pdfUrl: String,
    notes: String
  },
  { timestamps: true }
);

// Pre-save middleware to generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    this.invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('Invoice', invoiceSchema);
