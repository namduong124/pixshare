import Post from '../models/Post.js';
import mongoose from 'mongoose';


export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username avatar')
            .populate('comments.user', 'username avatar')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const createPost = async (req, res) => {
    const { caption, location, imageUrls } = req.body;
    try {
        const newPost = new Post({ 
            caption, location, imageUrls, 
            user: req.userId, 
        });
        await newPost.save();
        const fullPost = await Post.findById(newPost._id).populate('user', 'username avatar');
        res.status(201).json(fullPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};


export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
        const newComment = {
            user: req.userId,
            text,
            createdAt: new Date()
        };

        // Sử dụng $push để thêm comment trực tiếp vào mảng trong Database
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $push: { comments: newComment } },
            { new: true }
        )
        .populate('user', 'username avatar')
        .populate('comments.user', 'username avatar');

        if (!updatedPost) return res.status(404).json({ message: "Post not found" });

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Lỗi Server:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) return res.status(401).json({ message: 'Unauthenticated' });

    try {
        const post = await Post.findById(id);
        const index = post.likes.findIndex((userId) => String(userId) === String(req.userId));

        if (index === -1) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter((userId) => String(userId) !== String(req.userId));
        }

        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })
            .populate('user', 'username avatar')
            .populate('comments.user', 'username avatar');

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    const { id } = req.params; // ID của bài viết cần xóa
    try {
        const post = await Post.findById(id);

        if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết." });

        // KIỂM TRA QUYỀN: req.user.id lấy từ middleware verifyToken
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền xóa bài viết của người khác." });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa bài viết thành công." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};