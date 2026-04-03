import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';


dotenv.config();

const app = express();

// 2. MIDDLEWARES 
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;


if (!MONGO_URI) {
    console.error("❌ LỖI: Biến MONGO_URI chưa được thiết lập trong Environment của Render!");
} else {
    console.log("📡 Đang khởi tạo kết nối tới MongoDB...");
}


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
    res.status(200).send('PixShare API is running... 🚀');
});


mongoose.set('strictQuery', false); 
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB thành công!');
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server đang chạy tại: https://your-app-name.onrender.com (Port: ${PORT})`);
        });
    })
    .catch((err) => {
        console.error('❌ LỖI KẾT NỐI MONGODB:');
        console.error('Chi tiết lỗi:', err.message);
        console.log('👉 Mẹo: Hãy kiểm tra lại mật khẩu Database và Whitelist IP 0.0.0.0/0 trên Atlas.');
    });


process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err.message);
});