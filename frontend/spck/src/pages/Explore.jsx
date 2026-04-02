import { useEffect, useState } from 'react';
import { Loader2, Heart, MessageCircle } from 'lucide-react';
import PostModal from '../components/PostModal'; 
import * as api from '../api';

export default function Explore() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const { data } = await api.fetchPosts();
                setPosts(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchAll();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-pix-black">
            <h1 className="text-4xl font-black text-white mb-10 tracking-tighter uppercase">Explore</h1>

            {loading ? (
                <div className="flex justify-center py-40"><Loader2 className="animate-spin text-pix-gold" size={40} /></div>
            ) : (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {posts.map((post) => (
                        <div 
                            key={post._id} 
                            onClick={() => setSelectedPost(post)}
                            className="break-inside-avoid group relative overflow-hidden rounded-[2rem] border border-white/5 cursor-pointer bg-pix-dark transition-all duration-500 hover:border-pix-gold/30 shadow-lg"
                        >
                            <img 
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 block" 
                                src={post.imageUrls?.[0] || post.imageUrl} 
                                alt=""
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6">
                                <p className="text-white text-xs font-black truncate uppercase tracking-widest">{post.caption || "Untitled"}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-pix-gold text-[9px] font-black uppercase tracking-widest">@{post.user?.username}</span>
                                    <div className="flex gap-3 text-white">
                                        <div className="flex items-center gap-1 text-[10px]"><Heart size={12} fill="white"/> {post.likes?.length}</div>
                                        <div className="flex items-center gap-1 text-[10px]"><MessageCircle size={12} fill="white"/> {post.comments?.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL CHI TIẾT (PostModal) */}
            {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
        </div>
    );
}