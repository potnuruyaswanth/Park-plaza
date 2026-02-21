import mongoose from 'mongoose';

const paymentAuditSchema = new mongoose.Schema(
  {
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    action: { type: String, required: true }, // e.g., 'RECORD_CASH_PAYMENT'
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    actorRole: { type: String },
    details: { type: Object },
    ip: String
  },
  { timestamps: true }
);

export default mongoose.model('PaymentAudit', paymentAuditSchema);
