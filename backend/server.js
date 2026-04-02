import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

// 1. Cấu hình dotenv (Chỉ dùng file .env khi ở máy local)
dotenv.config();

const app = express();

// 2. MIDDLEWARES 
// Cực kỳ quan trọng: app.use(cors()) phải nằm TRÊN CÙNG để tránh lỗi CORS
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. LẤY BIẾN MÔI TRƯỜNG
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// Kiểm tra nhanh xem Render đã nhận được URI chưa (XEM TRONG TAB LOGS)
if (!MONGO_URI) {
    console.error("❌ LỖI: Biến MONGO_URI chưa được thiết lập trong Environment của Render!");
} else {
    console.log("📡 Đang khởi tạo kết nối tới MongoDB...");
}

// 4. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Route mặc định để kiểm tra server có sống hay không
app.get('/', (req, res) => {
    res.status(200).send('PixShare API is running... 🚀');
});

// 5. KẾT NỐI DATABASE VÀ CHẠY SERVER
mongoose.set('strictQuery', false); // Tránh cảnh báo của Mongoose
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB thành công!');
        
        // Chỉ chạy app.listen sau khi đã connect DB thành công
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server đang chạy tại: https://your-app-name.onrender.com (Port: ${PORT})`);
        });
    })
    .catch((err) => {
        console.error('❌ LỖI KẾT NỐI MONGODB:');
        console.error('Chi tiết lỗi:', err.message);
        console.log('👉 Mẹo: Hãy kiểm tra lại mật khẩu Database và Whitelist IP 0.0.0.0/0 trên Atlas.');
    });

// 6. XỬ LÝ LỖI TOÀN CỤC
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err.message);
});