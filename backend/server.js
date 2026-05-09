require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Import Auth Modules
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Import Routes
const destinationRoutes = require('./routes/destinationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const detailRoutes = require('./routes/detailRoutes');
const aiAssistantRoutes = require('./routes/aiAssistantRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Active Users Tracking
let activeUsers = 0;
io.on('connection', (socket) => {
  activeUsers++;
  io.emit('activeUsers', activeUsers);
  
  socket.on('disconnect', () => {
    activeUsers--;
    io.emit('activeUsers', activeUsers);
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas - Cholojai 4.0 Live!');
  
  // Create Default Admin
  try {
    const adminExists = await User.findOne({ email: 'admin@cholojai.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.create({
        name: 'Cholojai Admin',
        email: 'admin@cholojai.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Default Admin created: admin@cholojai.com / password123');
    }
  } catch (err) {
    console.error('❌ Failed to seed default admin', err);
  }
})
.catch((err) => console.error('❌ Failed to connect to MongoDB', err));

// Unified Professional Routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/details', detailRoutes);
app.use('/api/assistant', aiAssistantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, 'uploads')));

// Basic Route
app.get('/', (req, res) => {
  res.send('Cholojai API is running...');
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});
