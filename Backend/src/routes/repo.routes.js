import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { scanRepository } from '../controllers/review.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Repo scan route
router.post('/scan', scanRepository);

export default router;

