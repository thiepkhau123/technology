import { supabase } from '../supabase.js';

const phoneController = {
  getAllPhones: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('phones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createPhone: async (req, res) => {
    try {
      const { name, description, price, type, stock, image_url } = req.body;
      const { data, error } = await supabase
        .from('phones')
        .insert([{ 
          name, description, price, type, stock, image_url, is_active: true 
        }])
        .select();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deletePhone: async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('phones').delete().eq('id', id);
      if (error) throw error;
      res.status(200).json({ message: "Đã xóa" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export default phoneController;