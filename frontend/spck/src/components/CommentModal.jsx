import { X, Smile } from 'lucide-react';

export default function CommentModal({ post, onClose, comments, comment, setComment, handleCommentSubmit, isSubmitting }) {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <button onClick={onClose} className="absolute top-5 right-5 text-white hover:text-pix-gold transition">
                <X size={30} />
            </button>

            <div className="bg-pix-black w-full max-w-5xl h-[90vh] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10">
                {/* BÊN TRÁI: Hiện ảnh đầu tiên trong mảng imageUrls */}
                <div className="hidden md:block md:w-3/5 bg-black flex items-center justify-center">
                    <img src={post.imageUrls?.[0]} className="w-full h-full object-contain" alt="post" />
                </div>

                <div className="w-full md:w-2/5 flex flex-col bg-pix-dark">
                    <div className="p-4 border-b border-white/5 flex items-center gap-3">
                        <img src={post.user?.avatar} className="w-8 h-8 rounded-full border border-pix-gold/50" alt="" />
                        <span className="font-bold text-white text-sm">{post.user?.username}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        <div className="flex gap-3">
                            <img src={post.user?.avatar} className="w-8 h-8 rounded-full" alt="" />
                            <div className="text-sm">
                                <span className="font-bold text-white mr-2">{post.user?.username}</span>
                                <span className="text-white/80">{post.caption}</span>
                            </div>
                        </div>

                        {/* Danh sách bình luận */}
                        {comments.map((c, i) => (
                            <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="w-8 h-8 rounded-full bg-pix-gold/10 flex items-center justify-center text-[10px] font-bold text-pix-gold border border-pix-gold/20 flex-shrink-0">
                                    {(c.user?.username || c.username)?.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-sm">
                                    <span className="font-bold text-white mr-2">{c.user?.username || c.username}</span>
                                    <span className="text-white/70 leading-relaxed">{c.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-white/5 bg-pix-black">
                        <form onSubmit={handleCommentSubmit} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 border border-white/5 focus-within:border-pix-gold/30 transition-all">
                            <Smile size={20} className="text-pix-gray" />
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 placeholder:text-pix-gray/40"
                            />
                            <button
                                type="submit"
                                disabled={!comment.trim() || isSubmitting}
                                className="text-pix-gold font-bold text-xs uppercase tracking-widest disabled:opacity-0 transition-all"
                            >
                                {isSubmitting ? '...' : 'Post'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}