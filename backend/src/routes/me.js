import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getDashboardStats } from '../controllers/stats.controller.js';
import userController from '../controllers/userController.js'; // Import controller xử lý user

const router = express.Router();

/**
 * @route   GET /api/me
 * @desc    Lấy thông tin chi tiết của người dùng hiện tại từ bảng profiles
 * @access  Private
 */
router.get('/', authenticate, userController.getMe);

/**
 * @route   GET /api/me/stats
 * @desc    Lấy thông số thống kê dashboard
 * @access  Private
 */
router.get('/stats', authenticate, getDashboardStats);

export default router;