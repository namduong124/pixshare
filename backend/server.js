import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
// Import các routes (Chúng ta sẽ tạo các file này ở bước tiếp theo)
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

// Cấu hình dotenv để đọc file .env
dotenv.config();

const app = express();

// --- MIDDLEWARES ---
// Cho phép các domain khác truy cập (Cần thiết để Frontend Vite gọi API)
app.use(cors());
// Cho phép Express đọc dữ liệu JSON từ body của request
app.use(express.json());
// Cho phép Express đọc dữ liệu từ form (hữu ích cho việc upload)
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
// Route kiểm tra server
app.get('/', (req, res) => {
    res.send('PixShare API is running... 🚀');
});

// --- DATABASE CONNECTION ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        // Chỉ chạy server khi đã kết nối Database thành công
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });

// Xử lý lỗi hệ thống để server không bị crash bất ngờ
process.on('unhandledRejection', (err) => {
    console.log('Error:', err.message);
    // Bạn có thể thêm code đóng server tại đây nếu muốn
});