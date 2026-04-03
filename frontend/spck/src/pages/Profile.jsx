import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'; // QUAN TRỌNG: Để lấy ID từ URL
import { Loader2, Camera, X, UploadCloud, Grid3X3, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PostModal from '../components/PostModal';
import * as api from '../api';

// --- Giữ nguyên Component EditProfileModal của bạn ---
const EditProfileModal = ({ isOpen, onClose, currentUser, onUpdateSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser?.avatar || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];

    if (selectedFile) {

      setFile(selectedFile);

      setPreviewUrl(URL.createObjectURL(selectedFile));

    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return onClose();
    setLoading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const { data } = await api.updateProfile(formData);
      onUpdateSuccess(data);
      onClose();
    } catch (err) { alert("Cập nhật thất bại."); } finally { setLoading(false); }

  };
  if (!isOpen) return null;
  return (

    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-pix-dark border border-white/5 rounded-3xl w-full max-w-sm p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-pix-gray hover:text-white"><X size={20} /></button>
        <h3 className="text-xl font-bold mb-8 text-white tracking-tight text-center uppercase text-[12px] tracking-widest">Update Avatar</h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full border-2 border-pix-gold p-1 relative overflow-hidden group">
              <img src={previewUrl || currentUser?.avatar} className="w-full h-full rounded-full object-cover bg-pix-black" alt="preview" />
              <button type="button" onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Camera className="text-white mb-1" size={24} />
                <span className="text-[9px] text-white font-black uppercase tracking-widest">Upload</span>
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
          </div>
          <button type="submit" disabled={loading || !file} className="w-full bg-pix-gold text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><UploadCloud size={16} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function Profile() {
  const { id } = useParams(); // Lấy ID người dùng từ thanh địa chỉ
  const { user: currentUser, setUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null); // User đang được hiển thị
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Kiểm tra xem đây có phải là profile của chính mình không
  const isOwnProfile = !id || id === (currentUser?._id || currentUser?.id);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // 1. Xác định ID mục tiêu (Ưu tiên ID từ URL, nếu không có thì lấy của mình)
        const targetId = id || currentUser?._id || currentUser?.id;

        if (targetId) {
          // 2. Lấy thông tin User để hiển thị Header (Avatar, Username, Bio)
          // Bạn cần đảm bảo api.fetchUserById(targetId) đã hoạt động ở Backend
          const { data: userData } = await api.fetchUserById(targetId);
          setProfileUser(userData);

          // 3. Lấy tất cả bài viết và lọc theo targetId
          const { data: allPosts } = await api.fetchPosts();
          const filteredPosts = allPosts.filter(post =>
            (post.user?._id || post.user) === targetId
          );
          setUserPosts(filteredPosts);
        }
      } catch (err) {
        console.error("Lỗi tải trang profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, currentUser]); // Chạy lại mỗi khi ID trên URL thay đổi

  const handleUpdateSuccess = (updatedUserData) => {
    setUser(updatedUserData);
    setProfileUser(updatedUserData); // Cập nhật hiển thị ngay lập tức
    const localData = JSON.parse(localStorage.getItem('profile'));
    if (localData) {
      localStorage.setItem('profile', JSON.stringify({ ...localData, user: updatedUserData }));
    }
  };

  if (loading) return <div className="min-h-screen bg-pix-black flex items-center justify-center"><Loader2 className="animate-spin text-pix-gold" /></div>;
  if (!profileUser) return <div className="text-white text-center mt-20">User not found.</div>;

  return (
    <div className="min-h-screen bg-pix-black text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header Profile Info */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20 border-b border-white/5 pb-16">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-pix-gold to-transparent rounded-full blur opacity-25"></div>
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-2 border-pix-black p-1.5 bg-pix-black overflow-hidden shadow-2xl">
              <img src={profileUser.avatar} className="w-full h-full rounded-full object-cover" alt="avatar" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <h2 className="text-3xl font-black tracking-tight uppercase">{profileUser.username}</h2>

              {/* CHỈ HIỆN NÚT EDIT NẾU LÀ PROFILE CỦA MÌNH */}
              {isOwnProfile && (
                <button onClick={() => setIsEditModalOpen(true)} className="bg-white hover:bg-pix-gold text-black px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Edit Profile
                </button>
              )}

              {/* HIỆN NÚT FOLLOW NẾU LÀ PROFILE NGƯỜI KHÁC */}
              {!isOwnProfile && (
                <button className="bg-pix-gold text-black px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Follow
                </button>
              )}
            </div>

            <div className="flex justify-center md:justify-start gap-10">
              <div className="text-center md:text-left">
                <p className="text-lg font-black text-white">{userPosts.length}</p>
                <p className="text-[10px] text-pix-gray font-bold uppercase tracking-widest">Posts</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg font-black text-white">0</p>
                <p className="text-[10px] text-pix-gray font-bold uppercase tracking-widest">Followers</p>
              </div>
            </div>
            <p className="text-sm text-white/90 italic">"{profileUser.bio || "Crafting visual stories."}"</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center border-t border-white/5 mt-[-1px]">
          <button className="py-5 text-[10px] tracking-[0.3em] font-black border-t-2 border-pix-gold flex items-center gap-2 text-pix-gold">
            <Grid3X3 size={14} /> COLLECTIONS
          </button>
        </div>

        {/* Lưới ảnh Profile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 mt-8">
          {userPosts.map((post) => (
            <div
              key={post._id}
              onClick={() => setSelectedPost(post)}
              className="aspect-square overflow-hidden group relative cursor-pointer rounded-2xl border border-white/5"
            >
              <img src={post.imageUrls?.[0] || post.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="post" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                <div className="flex gap-8 text-white font-black">
                  <div className="flex items-center gap-2"><Heart size={20} fill="white" /> {post.likes?.length || 0}</div>
                  <div className="flex items-center gap-2"><MessageCircle size={20} fill="white" /> {post.comments?.length || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onCommentSuccess={(newComments) => {
            setUserPosts(prev => prev.map(p => p._id === selectedPost._id ? { ...p, comments: newComments } : p));
          }}
        />
      )}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} currentUser={currentUser} onUpdateSuccess={handleUpdateSuccess} />
    </div>
  );
}