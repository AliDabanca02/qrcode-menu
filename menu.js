// Menü verileri
const menuData = {
    soups: [
        { id: 1, name: 'Mercimek Çorbası', price: 35.00 },
        { id: 2, name: 'Domates Çorbası', price: 35.00 },
        { id: 3, name: 'Ezogelin Çorbası', price: 35.00 }
    ],
    mains: [
        { id: 4, name: 'Izgara Köfte', price: 120.00 },
        { id: 5, name: 'Tavuk Şiş', price: 100.00 },
        { id: 6, name: 'Pide', price: 90.00 }
    ],
    drinks: [
        { id: 7, name: 'Ayran', price: 15.00 },
        { id: 8, name: 'Kola', price: 20.00 },
        { id: 9, name: 'Su', price: 10.00 }
    ],
    desserts: [
        { id: 10, name: 'Künefe', price: 75.00 },
        { id: 11, name: 'Sütlaç', price: 45.00 },
        { id: 12, name: 'Baklava', price: 60.00 }
    ]
};

// Menü verilerini dışa aktar
window.menuData = menuData;