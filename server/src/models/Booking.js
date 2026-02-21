import mongoose from 'mongoose';
import { BOOKING_STATUS, SERVICE_TYPE } from '../config/constants.js';

const bookingSchema = new mongoose.Schema(
  {
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
    carDetails: {
      carNumber: {
        type: String,
        required: true
      },
      carModel: String,
      carColor: String,
      carImage: String
    },
    serviceType: {
      type: String,
      enum: Object.values(SERVICE_TYPE),
      required: true
    },
    duration: {
      type: String,
      enum: ['HOURLY', 'DAILY', 'WEEKLY'],
      default: 'HOURLY'
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    durationStartDate: Date,
    durationEndDate: Date,
    description: String,
    estimatedCost: Number,
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING
    },
    currentLocation: {
      lat: Number,
      lng: Number
    },
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
