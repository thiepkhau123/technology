import express from 'express';
// Đường dẫn đúng dựa trên middleware của bạn là lùi 1 cấp rồi tìm file supabase.js
import { supabase } from '../supabase.js';

const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        // Lấy dữ liệu song song từ 3 bảng để tối ưu tốc độ
        const [phonesRes, componentsRes, accountsRes] = await Promise.all([
            supabase.from('phones').select('*'),
            supabase.from('components').select('*'),
            supabase.from('accounts_ai').select('*')
        ]);

        // Kiểm tra lỗi phản hồi từ Supabase
        if (phonesRes.error) throw phonesRes.error;
        if (componentsRes.error) throw componentsRes.error;
        if (accountsRes.error) throw accountsRes.error;

        // Gộp tất cả lại thành một mảng và đảm bảo frontend nhận diện đúng loại
        const allProducts = [
            ...(phonesRes.data || []).map(p => ({ ...p, category: 'phone' })),
            ...(componentsRes.data || []).map(p => ({ ...p, category: 'component' })),
            ...(accountsRes.data || []).map(p => ({ ...p, category: 'account' }))
        ];

        res.json(allProducts);
    } catch (error) {
        console.error("Lỗi API tổng hợp sản phẩm:", error.message);
        res.status(500).json({ error: error.message });
    }
});
// Lấy chi tiết một sản phẩm theo category và id
router.get('/:category/:id', async (req, res) => {
    const { category, id } = req.params;

    // Xác định đúng tên bảng dựa trên category
    let tableName = '';
    if (category === 'phone') tableName = 'phones';
    else if (category === 'component') tableName = 'components';
    else if (category === 'account') tableName = 'accounts_ai';

    if (!tableName) {
        return res.status(400).json({ message: 'Danh mục không hợp lệ' });
    }

    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single(); // Chỉ lấy 1 bản ghi duy nhất

        if (error || !data) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Trả về dữ liệu sản phẩm
        res.json(data);
    } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error.message);
        res.status(500).json({ error: error.message });
    }
});
export default router;