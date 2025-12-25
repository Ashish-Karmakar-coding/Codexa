import express from 'express';
import { githubAuth, githubCallback, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);
router.get('/me', authenticate, getCurrentUser);

export default router;

