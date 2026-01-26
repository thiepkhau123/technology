import { supabase } from '../supabase.js';

const accountController = {
  // GET: Lấy danh sách account
  getAllAccounts: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('accounts_ai')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // POST: Thêm account mới
  // POST: Thêm account mới
  createAccount: async (req, res) => {
    try {
      const {
        email,
        provider,
        plan = 'Free',
        note = '',
        status = 'active',
        price = 0,        // THÊM: Lấy price từ request body
        image_url = null  // THÊM: Lấy image_url từ request body
      } = req.body;

      if (!email || !provider) {
        return res.status(400).json({ error: "Email và Provider không được để trống" });
      }

      const { data, error } = await supabase
        .from('accounts_ai')
        .insert([
          {
            email,
            provider,
            plan,
            status,
            note,
            price,       // THÊM: Đưa price vào câu lệnh insert
            image_url    // THÊM: Đưa image_url vào câu lệnh insert
          }
        ])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error("Lỗi Supabase:", error.message);
      res.status(400).json({ error: error.message });
    }
  },

  // DELETE: Xóa account
  deleteAccount: async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('accounts_ai')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true, message: "Đã xóa tài khoản" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  updateAccount: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, stock, price, image_url, login_info } = req.body;
      const { data, error } = await supabase
        .from('accounts')
        .update({ name, category, stock, price, image_url, login_info })
        .eq('id', id).select();
      if (error) throw error;
      res.status(200).json(data[0]);
    } catch (error) {
      res.status(400).json({ message: "Lỗi cập nhật", error: error.message });
    }
  },
};

export default accountController;