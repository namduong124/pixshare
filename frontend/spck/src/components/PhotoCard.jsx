import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Bookmark, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import PostModal from './PostModal';
import * as api from '../api';

export default function PhotoCard({ post }) {
    const { user: currentUser } = useAuth();
    const [likes, setLikes] = useState(post?.likes || []);
    const [commentsCount, setCommentsCount] = useState(post?.comments?.length || 0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const authorId = post.user?._id || post.user;
    const profilePath = currentUser?._id === authorId ? '/profile' : `/profile/${authorId}`;

    const handleLike = async () => {
        try {
            const { data } = await api.likePost(post._id);
            setLikes(data.likes);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="bg-pix-black border border-white/5 mb-10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/20 group">
            
            {/* Header người đăng */}
            <div className="p-5 flex items-center justify-between">
                <Link to={profilePath} className="flex items-center gap-3 group/author">
                    <img src={post.user?.avatar} className="w-11 h-11 rounded-full border-2 border-pix-black object-cover" alt="" />
                    <div>
                        <p className="text-sm font-black text-white group-hover:text-pix-gold transition-colors">{post.user?.username}</p>
                        <p className="text-[10px] text-pix-gray uppercase font-bold tracking-widest">{post.location || 'Explore'}</p>
                    </div>
                </Link>
                <MoreHorizontal size={20} className="text-pix-gray cursor-pointer" />
            </div>

            {/* Ảnh bài viết - Click để mở Modal xem chi tiết */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-black cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <img 
                    src={post.imageUrls?.[0] || post.imageUrl} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt="content" 
                />
            </div>

            {/* Thanh tương tác */}
            <div className="p-6">
                <div className="flex gap-6 mb-4">
                    <button onClick={handleLike} className={`transition-all hover:scale-125 ${likes.includes(currentUser?._id) ? 'text-red-500' : 'text-white'}`}>
                        <Heart size={28} fill={likes.includes(currentUser?._id) ? "currentColor" : "none"} />
                    </button>
                    
                    {/* Nút bình luận - Click để mở Modal giống Profile */}
                    <button onClick={() => setIsModalOpen(true)} className="text-white hover:text-pix-gold hover:scale-125 transition-all">
                        <MessageCircle size={28} />
                    </button>

                    <button className="text-white hover:text-pix-gold hover:scale-125 transition-all"><Share2 size={26} /></button>
                    <button className="text-white ml-auto hover:text-pix-gold transition-all"><Bookmark size={26} /></button>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-black text-white">{likes.length.toLocaleString()} likes</p>
                    <div className="text-sm leading-relaxed text-white/80">
                        <Link to={profilePath} className="font-black text-white mr-2 hover:text-pix-gold">{post.user?.username}</Link>
                        {post.caption}
                    </div>
                    
                    {/* Nút xem bình luận */}
                    <button onClick={() => setIsModalOpen(true)} className="text-[11px] text-pix-gray font-black uppercase mt-2 tracking-widest hover:text-pix-gold transition-all">
                        View all {commentsCount} comments
                    </button>
                </div>
            </div>

            {/* Gọi Component PostModal dùng chung */}
            {isModalOpen && (
                <PostModal 
                    post={post} 
                    onClose={() => setIsModalOpen(false)} 
                    onCommentSuccess={(newComments) => setCommentsCount(newComments.length)}
                />
            )}
        </div>
    );
}