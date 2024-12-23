import { Server } from 'socket.io';
import http from 'http';

const httpServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket sunucusu çalışıyor. WebSocket bağlantısı için uygun istemcileri kullanın.\n');
});

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

let orders = [];

io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı.');

    socket.on('newOrder', (order) => {
        orders.push(order);
        console.log('Yeni Sipariş:', order);
        io.emit('updateOrders', orders);
    });

    socket.on('completeOrder', (timestamp) => {
        orders = orders.filter(order => order.timestamp !== timestamp);
        console.log(`Sipariş tamamlandı: ${timestamp}`);
        io.emit('updateOrders', orders);
    });

    socket.on('disconnect', () => {
        console.log('Bir kullanıcı ayrıldı.');
    });
});

// Sunucuyu başlat
httpServer.listen(3000, () => {
    console.log('Sunucu http://localhost:3000 adresinde çalışıyor');
});
