document.addEventListener('DOMContentLoaded', () => {
    // URL'den masa numarasını al
    const urlParams = new URLSearchParams(window.location.search);
    const tableNumber = urlParams.get('table');
    
    if (tableNumber) {
        document.getElementById('table-number').textContent = tableNumber;
    } else {
        window.location.href = 'error.html'; // Masa numarası yoksa hata sayfasına yönlendir
    }

    // WebSocket bağlantısını kur
    const socket = io('http://localhost:3000');

    // Sekme değiştirme işlevselliği
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuSections = document.querySelectorAll('.menu-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Aktif sekmeyi değiştir
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Menü bölümünü değiştir
            menuSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === category) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Menüyü yükle
    loadMenu();

    // Sipariş takibi için
    let currentOrder = [];

    function loadMenu() {
        Object.keys(menuData).forEach(category => {
            const section = document.getElementById(category);
            
            menuData[category].forEach(item => {
                const itemElement = createMenuItem(item);
                section.appendChild(itemElement);
            });
        });
    }

    function createMenuItem(item) {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.price.toFixed(2)} TL</p>
            <button onclick="addToOrder(${item.id})">Sepete Ekle</button>
        `;
        return div;
    }

    // Sepete ekleme fonksiyonu
    window.addToOrder = (itemId) => {
        let item = null;
        
        // Menüde ürünü bul
        Object.values(menuData).forEach(category => {
            const found = category.find(i => i.id === itemId);
            if (found) item = found;
        });

        if (item) {
            currentOrder.push(item);
            updateOrderSummary();
        }
    };

    function updateOrderSummary() {
        const orderItems = document.getElementById('order-items');
        const totalAmount = document.getElementById('total-amount');
        
        orderItems.innerHTML = '';
        let total = 0;

        currentOrder.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                ${item.name} - ${item.price.toFixed(2)} TL
                <button onclick="removeFromOrder(${index})">X</button>
            `;
            orderItems.appendChild(itemDiv);
            total += item.price;
        });

        totalAmount.textContent = `${total.toFixed(2)} TL`;
    }

    // Sepetten ürün çıkarma
    window.removeFromOrder = (index) => {
        currentOrder.splice(index, 1);
        updateOrderSummary();
    };

    // Sipariş onaylama
    document.getElementById('submit-order').addEventListener('click', () => {
        if (currentOrder.length === 0) {
            alert('Lütfen sipariş vermek için ürün ekleyin!');
            return;
        }

        const order = {
            tableNumber,
            items: currentOrder,
            total: currentOrder.reduce((sum, item) => sum + item.price, 0),
            status: 'new',
            timestamp: new Date().toISOString()
        };

        // Siparişi WebSocket ile sunucuya gönder
        socket.emit('newOrder', order);

        currentOrder = [];
        updateOrderSummary();
        alert('Siparişiniz alındı!');
    });
});
