import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import upload, { uploadToCloudinary } from '../middleware/cloudinary.js'; 
import { deletePost } from '../controllers/posts.js';
import { 
    getPosts, 
    createPost, 
    commentPost, 
    likePost 
} from '../controllers/posts.js';

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Lấy tất cả bài đăng (Public)
 */
router.get('/', getPosts);

/**
 * @route   POST /api/posts
 * @desc    Đăng bài viết mới với NHIỀU ẢNH (Cần đăng nhập)
 * @access  Private
 * * Thay đổi: 
 * - upload.array('images', 5): Nhận mảng file từ field có tên 'images', tối đa 5 file.
 * - uploadToCloudinary: Middleware này cần xử lý req.files thay vì req.file.
 */
router.post(
    '/', 
    verifyToken, 
    upload.array('images', 5), 
    uploadToCloudinary, 
    createPost
);

/**
 * @route   POST /api/posts/:id/commentPost
 * @desc    Bình luận vào bài viết
 */
router.post('/:id/commentPost', verifyToken, commentPost);

/**
 * @route   PATCH /api/posts/:id/likePost
 * @desc    Like hoặc Unlike bài viết
 */
router.patch('/:id/likePost', verifyToken, likePost);
router.delete('/:id', verifyToken, deletePost);

export default router;