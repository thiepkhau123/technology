import express from 'express';
import phoneController from '../controllers/phone.controller.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAdmin, phoneController.getAllPhones);
router.post('/', requireAdmin, phoneController.createPhone);
router.delete('/:id', requireAdmin, phoneController.deletePhone);
router.put('/:id', requireAdmin, phoneController.updatePhone);

export default router;