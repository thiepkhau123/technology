// backend/src/controllers/stats.controller.js
import { supabase } from '../supabase.js';

// backend/src/controllers/stats.controller.js
export const getDashboardStats = async (req, res) => {
  try {
    // Lấy tổng số lượng (giữ nguyên)
    const { count: totalAccounts } = await supabase.from('accounts_ai').select('*', { count: 'exact', head: true });
    const { count: totalPhones } = await supabase.from('phones').select('*', { count: 'exact', head: true });
    const { count: totalComponents } = await supabase.from('components').select('*', { count: 'exact', head: true });
    const { count: lowStockPhones } = await supabase.from('phones').select('*', { count: 'exact', head: true }).lt('stock', 3);

    // LẤY DỮ LIỆU TỔNG HỢP
    const [phones, components, accounts] = await Promise.all([
      supabase.from('phones').select('name, type, price, stock, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('components').select('name, type, price, stock, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('accounts_ai').select('name, type, price, stock, created_at').order('created_at', { ascending: false }).limit(3)
    ]);

    // Gộp tất cả lại và sắp xếp theo ngày mới nhất
    const allRecent = [
      ...(phones.data || []),
      ...(components.data || []),
      ...(accounts.data || [])
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);

    res.json({
      totalAccounts: totalAccounts || 0,
      totalPhones: totalPhones || 0,
      totalComponents: totalComponents || 0,
      lowStockCount: lowStockPhones || 0,
      recentProducts: allRecent // Trả về danh sách tổng hợp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};