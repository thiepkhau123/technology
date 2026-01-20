const API_URL = 'http://localhost:4000/api'

async function loadAccounts() {
  const res = await fetch(`${API_URL}/accounts`)
  const data = await res.json()

  const container = document.getElementById('accountList')
  container.innerHTML = ''

  data.forEach(acc => {
    const div = document.createElement('div')
    div.className = 'bg-white p-4 rounded shadow'

    div.innerHTML = `
      <h2 class="font-bold text-lg">${acc.title}</h2>
      <p class="text-sm text-gray-600">${acc.description || ''}</p>
      <p class="text-red-600 font-semibold mt-2">${acc.price} VNĐ</p>

      <button
        class="mt-3 bg-blue-600 text-white px-3 py-2 rounded w-full"
        onclick="buyAccount('${acc.id}')"
      >
        Mua ngay
      </button>
    `
    container.appendChild(div)
  })
}

function buyAccount(id) {
  alert('Bước tiếp theo: mua account ID ' + id)
}

loadAccounts()
