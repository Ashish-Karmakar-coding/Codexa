import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  createReview,
  getReviews,
  getReviewById,
  deleteReview,
  scanRepository
} from '../controllers/review.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Review routes
router.post('/', createReview);
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.delete('/:id', deleteReview);

export default router;

