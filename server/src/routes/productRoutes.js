import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:productId', getProductById);

// Admin only routes
router.post('/', authMiddleware, roleMiddleware('ADMIN'), createProduct);
router.put('/:productId', authMiddleware, roleMiddleware('ADMIN'), updateProduct);
router.delete('/:productId', authMiddleware, roleMiddleware('ADMIN'), deleteProduct);

export default router;
