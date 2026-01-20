import express from 'express'
import { requireAdmin } from '../middlewares/admin.js'

const router = express.Router()

router.get('/admin/dashboard', requireAdmin, (req, res) => {
  res.json({
    message: 'Welcome Admin',
    userId: req.user.id
  })
})

export default router
