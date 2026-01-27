import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js'; // Middleware của bạn

const router = express.Router();

// Lấy thông tin cá nhân - Yêu cầu: Chỉ cần đăng nhập
router.get('/me', authenticate, userController.getMe);

// Cập nhật Profile - Yêu cầu: Chỉ cần đăng nhập
router.put('/profile/update', authenticate, userController.updateProfile);

// Đổi mật khẩu - Yêu cầu: Chỉ cần đăng nhập
router.put('/profile/change-password', authenticate, userController.changePassword);

export default router;