import { supabaseAdmin } from '../supabase.js'

const userController = {
// src/controllers/userController.js
getMe: async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        // Trả về dữ liệu từ bảng profiles, 
        // Đảm bảo bảng này có các cột: email, full_name, role, created_at
        res.status(200).json(data); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

  // Cập nhật full_name vào bảng public.profiles
  updateProfile: async (req, res) => {
    try {
      const { full_name } = req.body;
      const userId = req.user.id;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ full_name: full_name })
        .eq('id', userId)
        .select();

      if (error) throw error;
      res.status(200).json({ message: "Cập nhật thành công", data: data[0] });
    } catch (error) {
      res.status(400).json({ message: "Lỗi cập nhật hồ sơ", error: error.message });
    }
  },

  // Đổi mật khẩu (Vẫn dùng auth.admin vì mật khẩu nằm ở tầng Auth)
  changePassword: async (req, res) => {
    try {
      const { password } = req.body;
      const userId = req.user.id;

      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password: password }
      );

      if (error) throw error;
      res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
      res.status(400).json({ message: "Lỗi đổi mật khẩu", error: error.message });
    }
  }
};

export default userController;