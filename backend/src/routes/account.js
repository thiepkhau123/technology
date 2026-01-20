import express from 'express';
import accountController from '../controllers/account.controller.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET: Lấy danh sách account
router.get('/', requireAdmin, accountController.getAllAccounts);

// POST: Thêm account mới
router.post('/', requireAdmin, accountController.createAccount);

// DELETE: Xóa account
router.delete('/:id', requireAdmin, accountController.deleteAccount);

export default router;