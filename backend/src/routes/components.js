import express from 'express';
import componentController from '../controllers/component.controller.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Lấy danh sách linh kiện
router.get('/', requireAdmin, componentController.getAllComponents);

// Thêm linh kiện mới
router.post('/', requireAdmin, componentController.createComponent);

// Xóa linh kiện
router.delete('/:id', requireAdmin, componentController.deleteComponent);

export default router;