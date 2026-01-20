import { supabaseAdmin } from '../supabase.js'

// Middleware 1: Xác thực người dùng (Chỉ cần đăng nhập)
export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'No token' })

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error) return res.status(401).json(error)

  req.user = data.user
  next()
}

// Middleware 2: Kiểm tra quyền Admin (Bổ sung hàm này)
export async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'No token' })

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return res.status(401).json({ message: 'Unauthorized' })

  // Kiểm tra metadata hoặc email để xác định admin
  // Cách phổ biến: Kiểm tra trường role trong user_metadata của Supabase
  const isAdmin = data.user.app_metadata?.role === 'admin' || 
                  data.user.user_metadata?.role === 'admin' ||
                  data.user.email === 'ngocthiep213@gmail.com'; // Thay bằng email admin của bạn

  if (!isAdmin) {
    return res.status(403).json({ message: 'Quyền truy cập bị từ chối: Yêu cầu quyền Admin' })
  }

  req.user = data.user
  next()
}