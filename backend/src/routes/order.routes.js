import express from 'express';
import { supabase } from '../supabase.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js'; // Đảm bảo bạn đã import middleware này

const router = express.Router();

// ==========================================
// PHẦN 1: ADMIN ROUTES (PHẢI ĐẶT TRÊN CÙNG)
// ==========================================

/**
 * @route   GET /api/orders/admin/all
 * @desc    Admin lấy toàn bộ danh sách đơn hàng của hệ thống
 */
// Route lấy toàn bộ đơn hàng cho Admin
router.get('/admin/all', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                profiles (
                    email,
                    full_name
                )
            `) // Dùng profiles thay vì users
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   PUT /api/orders/admin/:id
 * @desc    Admin cập nhật trạng thái đơn và bàn giao dữ liệu (Key/Acc)
 */
router.put('/admin/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, delivery_data } = req.body;

    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        delivery_data,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    res.json(data[0]);
  } catch (error) {
    console.error('Lỗi Admin cập nhật đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi cập nhật Admin', error: error.message });
  }
});


// ==========================================
// PHẦN 2: USER ROUTES
// ==========================================

/**
 * @route   GET /api/orders
 * @desc    Người dùng lấy lịch sử đơn hàng cá nhân
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Lỗi lấy đơn hàng user:', error);
    res.status(500).json({ message: 'Không thể tải đơn hàng', error: error.message });
  }
});

/**
 * @route   POST /api/orders
 * @desc    Tạo đơn hàng mới
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { product_id, category, total_price, payment_method, note, quantity } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          product_id,
          category,
          total_price,
          payment_method,
          status: 'pending',
          note,
          quantity: quantity || 1
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error: error.message });
  }
});

/**
 * @route   PATCH /api/orders/:id
 * @desc    Người dùng tự hủy đơn hoặc sửa ghi chú (chỉ khi pending)
 */
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const userId = req.user.id;

    // 1. Kiểm tra quyền sở hữu và trạng thái hiện tại
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingOrder) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc không thuộc về bạn' });
    }

    // 2. Chặn nếu đơn đã xử lý xong mà user vẫn đòi hủy/sửa
    if (existingOrder.status !== 'pending') {
      return res.status(400).json({ message: 'Đơn hàng đã được xử lý, không thể thay đổi' });
    }

    const updateData = {};
    if (status === 'cancelled') updateData.status = 'cancelled';
    if (note) updateData.note = note;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Lỗi cập nhật đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật', error: error.message });
  }
});

export default router;