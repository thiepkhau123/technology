import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { requireRole } from '../middleware/role.js'

// Import kiểu Default (vì bạn dùng export default trong controller)
import accountController from '../controllers/account.controller.js'
import phoneController from '../controllers/phone.controller.js'
import componentController from '../controllers/component.controller.js'

// Import kiểu Named (vì bạn dùng export const trong stats controller)
import { getDashboardStats } from '../controllers/stats.controller.js'

const router = express.Router()

/**
 * QUẢN LÝ TÀI KHOẢN AI
 */
router.post(
  '/admin/accounts',
  authenticate,
  requireRole('admin'),
  accountController.createAccount // SỬA: Trước đây bạn viết là createDigitalAccount
)

/**
 * QUẢN LÝ ĐIỆN THOẠI
 */
router.post(
  '/admin/phones',
  authenticate,
  requireRole('admin'),
  phoneController.createPhone // Đã khớp
)

/**
 * QUẢN LÝ LINH KIỆN
 */
router.post(
  '/admin/components',
  authenticate,
  requireRole('admin'),
  componentController.createComponent // Đã khớp
)

/**
 * LẤY THỐNG KÊ DASHBOARD
 */
router.get(
  '/admin/stats',
  authenticate,
  requireRole('admin'),
  getDashboardStats // Đã khớp
)

export default router