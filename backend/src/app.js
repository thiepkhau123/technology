import express from 'express'
import cors from 'cors'

// Import các routes
import authRoutes from './routes/auth.routes.js'
import accountRoutes from './routes/account.js'
import meRoutes from './routes/me.js'
import phoneRoutes from './routes/phones.js' // Sửa tên biến cho đồng nhất
import componentRoutes from './routes/components.js' // Sửa tên biến cho đồng nhất
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import adminRoutes from './routes/admin.routes.js';

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Cấu hình Routes - Mỗi tài nguyên nên có một tiền tố (prefix) riêng biệt
app.use('/api/auth', authRoutes)         // Ví dụ: /api/auth/login
app.use('/api/accounts', accountRoutes) // Đường dẫn đúng cho CRUD account AI của bạn
app.use('/api/me', meRoutes)            
app.use('/api/phones', phoneRoutes)      
app.use('/api/components', componentRoutes)
app.use('/api/products', productRoutes)  // Đường dẫn đúng cho sản phẩm tổng hợp
app.use('/api/orders', orderRoutes);
app.use('/api', adminRoutes);

// Middleware xử lý lỗi 404 cho các route không tồn tại (tránh trả về HTML mặc định)
app.use((req, res) => {
  res.status(404).json({ message: `Không tìm thấy đường dẫn ${req.originalUrl} trên Server` })
})

export default app