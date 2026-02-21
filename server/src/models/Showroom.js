import mongoose from 'mongoose';

const showroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide showroom name'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please provide address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    totalParkingSlots: {
      type: Number,
      required: [true, 'Please provide total parking slots'],
      min: 1
    },
    availableSlots: {
      type: Number,
      required: true
    },
    facilities: [String], // ['WiFi', 'CCTV', 'Car Wash', 'Repair', 'EV Charging']
    phoneNumber: String,
    operatingHours: {
      open: String,
      close: String
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Create geospatial index for nearby location queries
showroomSchema.index({ 'location': '2dsphere' });

export default mongoose.model('Showroom', showroomSchema);
