const { Server } = require('socket.io');

const io = new Server(3001, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Tham gia phòng
  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', user);
    console.log(`${user.username} joined room ${roomId}`);
  });

  // Gửi và nhận tin nhắn
  socket.on('send-message', ({ roomId, message, user }) => {
    io.to(roomId).emit('receive-message', { message, user });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

console.log('Socket.IO server running on port 3001');