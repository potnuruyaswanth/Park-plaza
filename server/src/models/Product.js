import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['ENGINE_PARTS', 'TIRES', 'BATTERIES', 'BRAKES', 'OILS_FLUIDS', 'ACCESSORIES', 'ELECTRICAL', 'SUSPENSION', 'BODY_PARTS', 'OTHER']
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0
    },
    originalPrice: {
      type: Number,
      default: null
    },
    images: [{
      type: String
    }],
    brand: {
      type: String,
      trim: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    sku: {
      type: String,
      unique: true,
      sparse: true
    },
    specifications: {
      type: Map,
      of: String
    },
    compatibility: [{
      make: String,
      model: String,
      year: String
    }],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    tags: [String]
  },
  { timestamps: true }
);

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
