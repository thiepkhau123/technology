// src/routes/me.js
import express from 'express'
import { authenticate } from '../middleware/auth.js' // Giả sử file này export 'authenticate'
import { getDashboardStats } from '../controllers/stats.controller.js';

const router = express.Router()

// GET /api/me - Lấy thông tin user hiện tại
router.get('/', authenticate, (req, res) => {
  res.json({
    email: req.user.email,
    role: (req.user.email === 'ngocthiep213@gmail.com') ? 'admin' : 'user'
  });
});

// GET /api/me/stats - Lấy thống kê (Sửa requireAdmin thành authenticate)
router.get('/stats', authenticate, getDashboardStats);

export default router