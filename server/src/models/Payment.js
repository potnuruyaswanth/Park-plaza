import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true
    },
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
    showroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showroom',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['RAZORPAY', 'UPI', 'CARD', 'NET_BANKING', 'CASH'],
      default: 'RAZORPAY'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING'
    },
    paymentDate: Date,
    refundedDate: Date,
    refundAmount: {
      type: Number,
      default: 0
    },
    failureReason: String
    ,
    receiptUrl: String
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
