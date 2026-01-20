// frontend/js/auth.js

// Hàm kiểm tra quyền Admin chuyên dụng cho trang Dashboard
async function checkAdmin() {
    const token = localStorage.getItem('access_token');
    const content = document.getElementById('content');
    const forbidden = document.getElementById('forbidden');

    if (!token) {
        showForbidden(content, forbidden);
        return Promise.reject('No token');
    }

    try {
        const res = await fetch('http://localhost:4000/api/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Not authorized');

        const userData = await res.json();

        // Kiểm tra quyền: Email admin hoặc role admin
        if (userData.role === 'admin' || userData.email === 'ngocthiep213@gmail.com') {
            if (content) content.classList.remove('hidden');
            if (forbidden) forbidden.classList.add('hidden');
            return userData;
        } else {
            throw new Error('Permission denied');
        }
    } catch (err) {
        showForbidden(content, forbidden);
        return Promise.reject(err);
    }
}

function showForbidden(content, forbidden) {
    if (content) content.classList.add('hidden');
    if (forbidden) forbidden.classList.remove('hidden');
}

function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    window.location.href = '../index.html'; 
}