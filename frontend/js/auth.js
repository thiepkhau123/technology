const API_URL = 'http://localhost:4000/api'

/* ================= LOGIN ================= */
async function login() {
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.error_description || data.error || 'Đăng nhập thất bại')
            return
        }

        localStorage.setItem('access_token', data.session.access_token)
        location.href = 'index.html'
    } catch (err) {
        console.error("Login error:", err)
    }
}

/* ================= REGISTER ================= */
async function register() {
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.error_description || data.error || 'Đăng ký thất bại')
            return
        }

        alert('Đăng ký thành công!');
        localStorage.setItem('remembered_email', email); // Lưu tạm email
        location.href = 'login.html';
    } catch (err) {
        console.error("Register error:", err)
    }
}

/* ================= LOGOUT ================= */
function logout() {
    localStorage.removeItem('access_token')
    location.href = 'index.html'
}

/* ================= CHECK AUTH (HEADER & HOME) ================= */
async function checkAuth() {
    const token = localStorage.getItem('access_token');
    const guestDiv = document.getElementById('guest');
    const userDiv = document.getElementById('user');
    const usernameDisplay = document.getElementById('username');
    const adminLink = document.getElementById('admin-link');

    if (!token) {
        guestDiv?.classList.remove('hidden');
        userDiv?.classList.add('hidden');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            logout();
            return;
        }

        const user = await res.json();

        // 1. Hiển thị khu vực User, ẩn Guest
        guestDiv?.classList.add('hidden');
        userDiv?.classList.remove('hidden');

        // 2. XỬ LÝ TÊN HIỂN THỊ (Sửa lỗi NULL/Undefined từ database của bạn)
        let displayName = "Thành viên";

        // Nếu full_name có dữ liệu và không phải chuỗi "NULL"
        if (user.full_name && user.full_name !== "NULL") {
            displayName = user.full_name;
        }
        // Nếu full_name null, lấy phần tên từ email (ví dụ: ngocthiep213)
        else if (user.email) {
            displayName = user.email.split('@')[0];
        }

        if (usernameDisplay) {
            usernameDisplay.innerText = displayName;
        }

        // 3. KIỂM TRA QUYỀN ADMIN (Dựa trên cột role và email admin của bạn)
        if (user.role === 'admin' || user.email === 'ngocthiep213@gmail.com') {
            adminLink?.classList.remove('hidden');
        }

    } catch (error) {
        console.error("Auth check error:", error);
    }
}

/* ================= CHECK ADMIN (ADMIN PAGE) ================= */
async function checkAdmin() {
    const token = localStorage.getItem('access_token')

    if (!token) {
        location.href = 'login.html'
        return
    }

    try {
        const res = await fetch(`${API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!res.ok) {
            logout()
            return
        }

        const user = await res.json()

        if (user.role !== 'admin' && user.email !== 'ngocthiep213@gmail.com') {
            document.getElementById('forbidden')?.classList.remove('hidden')
            return
        }

        document.getElementById('content')?.classList.remove('hidden')
        // Hiển thị email hoặc tên tại trang admin info
        const adminInfo = document.getElementById('adminInfo');
        if (adminInfo) adminInfo.innerText = user.email;
    } catch (err) {
        console.error("Admin check error:", err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Nếu không phải trang admin thì chạy checkAuth
    if (!window.location.pathname.includes('admin')) {
        checkAuth();
    }
});