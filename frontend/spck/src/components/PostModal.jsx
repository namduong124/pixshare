import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // QUAN TRỌNG: Để chuyển trang
import * as api from '../api';
import { useAuth } from '../context/AuthContext';

export default function PostModal({ post, onClose }) {
    const { user: currentUser } = useAuth();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post?.comments || []);
    const [likes, setLikes] = useState(post?.likes || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);

    // Xác định đường dẫn Profile của chủ bài viết
    const authorId = post.user?._id || post.user;
    const authorProfilePath = currentUser?._id === authorId ? '/profile' : `/profile/${authorId}`;

    useEffect(() => {
        setComments(post.comments || []);
        setLikes(post.likes || []);
    }, [post]);

    const handleLike = async () => {
        try {
            const { data } = await api.likePost(post._id);
            setLikes(data.likes);
        } catch (err) { console.error(err); }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const { data } = await api.commentPost(comment.trim(), post._id);
            setComments(data.comments);
            setComment('');
        } catch (err) { console.error(err); }
        finally { setIsSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
            <button onClick={onClose} className="absolute top-5 right-5 text-white/40 hover:text-pix-gold transition-all"><X size={35} /></button>
            
            <div className="bg-pix-black w-full max-w-6xl h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-white/10 shadow-2xl">
                
                {/* BÊN TRÁI: CAROUSEL ẢNH */}
                <div className="relative hidden md:flex md:w-3/5 bg-black border-r border-white/5 items-center justify-center overflow-hidden">
                    <div className="flex w-full h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentImg * 100}%)` }}>
                        {post.imageUrls?.map((url, i) => (
                            <img key={i} src={url} className="w-full h-full object-contain flex-shrink-0" alt="" />
                        ))}
                    </div>
                    {post.imageUrls?.length > 1 && (
                        <>
                            <button onClick={() => setCurrentImg(prev => prev - 1)} disabled={currentImg === 0} className="absolute left-4 p-2 bg-black/50 rounded-full text-white hover:bg-pix-gold disabled:opacity-0 transition-all"><ChevronLeft size={20} /></button>
                            <button onClick={() => setCurrentImg(prev => prev + 1)} disabled={currentImg === post.imageUrls.length - 1} className="absolute right-4 p-2 bg-black/50 rounded-full text-white hover:bg-pix-gold disabled:opacity-0 transition-all"><ChevronRight size={20} /></button>
                        </>
                    )}
                </div>

                {/* BÊN PHẢI: INFO & COMMENTS */}
                <div className="w-full md:w-2/5 flex flex-col bg-pix-dark">
                    {/* Header người đăng */}
                    <div className="p-4 border-b border-white/5 flex items-center gap-3">
                        <Link to={authorProfilePath} onClick={onClose} className="flex items-center gap-3 group">
                            <img src={post.user?.avatar} className="w-9 h-9 rounded-full border border-pix-gold/30 object-cover" alt="" />
                            <span className="font-bold text-white text-sm group-hover:text-pix-gold transition-colors">{post.user?.username}</span>
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {/* Caption gốc */}
                        <div className="flex gap-3 mb-6">
                            <Link to={authorProfilePath} onClick={onClose}>
                                <img src={post.user?.avatar} className="w-8 h-8 rounded-full flex-shrink-0 object-cover" alt="" />
                            </Link>
                            <div className="text-sm">
                                <Link to={authorProfilePath} onClick={onClose} className="font-bold text-white mr-2 hover:text-pix-gold">
                                    {post.user?.username}
                                </Link>
                                <span className="text-white/80">{post.caption}</span>
                            </div>
                        </div>

                        {/* List bình luận */}
                        {comments.map((c, i) => {
                            // Logic đường dẫn cho từng người bình luận
                            const commenterId = c.user?._id || c.user;
                            const commenterPath = currentUser?._id === commenterId ? '/profile' : `/profile/${commenterId}`;

                            return (
                                <div key={i} className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
                                    <Link to={commenterPath} onClick={onClose}>
                                        <div className="w-8 h-8 rounded-full bg-pix-gold/10 flex items-center justify-center text-[10px] text-pix-gold font-bold flex-shrink-0">
                                            {(c.user?.username || 'U').charAt(0).toUpperCase()}
                                        </div>
                                    </Link>
                                    <div className="text-sm">
                                        <Link to={commenterPath} onClick={onClose} className="font-bold text-white mr-2 hover:text-pix-gold">
                                            {c.user?.username}
                                        </Link>
                                        <span className="text-white/70">{c.text}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Interaction Bar & Form */}
                    <div className="p-4 border-t border-white/5 bg-pix-black space-y-4">
                        <div className="flex gap-4">
                            <button onClick={handleLike} className={likes.includes(currentUser?._id) ? 'text-red-500' : 'text-white'}>
                                <Heart size={24} fill={likes.includes(currentUser?._id) ? "currentColor" : "none"} />
                            </button>
                            <span className="text-xs font-bold text-white">{likes.length} likes</span>
                        </div>

                        <form onSubmit={handleCommentSubmit} className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/5">
                            <input
                                type="text" placeholder="Add a comment..." value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 outline-none"
                            />
                            <button type="submit" disabled={!comment.trim() || isSubmitting} className="text-pix-gold font-black text-xs uppercase">
                                {isSubmitting ? '...' : 'Post'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}