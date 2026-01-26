import { supabase } from '../supabase.js';

const componentController = {
  // Lấy danh sách linh kiện
  getAllComponents: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy dữ liệu linh kiện", error: error.message });
    }
  },

  // Thêm mới linh kiện
  createComponent: async (req, res) => {
    try {
      const { name, category, stock, price, image_url } = req.body;
      const { data, error } = await supabase
        .from('components')
        .insert([{
          name,
          category,
          stock: parseInt(stock),
          price: parseFloat(price) || 0,
          image_url,
          is_active: true
        }])
        .select();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: "Lỗi thêm linh kiện", error: error.message });
    }
  },

  // Xóa linh kiện
  deleteComponent: async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('components')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(200).json({ message: "Đã xóa linh kiện" });
    } catch (error) {
      res.status(400).json({ message: "Lỗi khi xóa linh kiện", error: error.message });
    }
  },

  // Thêm hàm này vào trong object componentController
  updateComponent: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, stock, price, image_url } = req.body;

      const { data, error } = await supabase
        .from('components')
        .update({
          name,
          category,
          stock: parseInt(stock),
          price: parseFloat(price) || 0,
          image_url
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data.length === 0) return res.status(404).json({ message: "Không tìm thấy linh kiện" });

      res.status(200).json(data[0]);
    } catch (error) {
      res.status(400).json({ message: "Lỗi khi cập nhật", error: error.message });
    }
  },
};

export default componentController;