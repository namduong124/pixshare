import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PlusSquare, Compass, LogOut, User, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsSearching(true);
        setShowDropdown(true); 
        try {
          const { data } = await api.searchUsers(searchTerm);
          setSearchResults(Array.isArray(data) ? data : []);
        } catch (err) {
          setSearchResults([]); // Reset 
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-b border-white/5 bg-pix-black/80 backdrop-blur-xl sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 bg-pix-gold rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-300 shadow-lg shadow-pix-gold/20">
            <span className="text-black font-black text-xl">L</span>
          </div>
          <span className="text-2xl font-black italic text-white tracking-tighter group-hover:text-pix-gold transition-colors">
            ALim
          </span>
        </Link>

        {/* SEARCH BAR */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-10 relative group">
          <div className="relative w-full">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchTerm ? 'text-pix-gold' : 'text-pix-gray'}`} />
            <input
              type="text"
              placeholder="Search creators, art..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-10 py-2.5 text-sm text-white focus:border-pix-gold/40 focus:bg-pix-dark outline-none transition-all placeholder:text-pix-gray/40 shadow-inner"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pix-gold animate-spin" />
            )}
          </div>

          {/* SEARCH RESULTS DROPDOWN */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-pix-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-[350px] overflow-y-auto py-2 custom-scrollbar">
                {isSearching ? (
                  <div className="px-4 py-8 text-center flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-pix-gold animate-spin" />
                    <p className="text-[10px] text-pix-gray uppercase tracking-widest font-bold">Searching creators...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((u) => (
                    <Link
                      key={u._id}
                      to={`/profile/${u._id}`}
                      onClick={() => { setShowDropdown(false); setSearchTerm(''); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition group border-b border-white/5 last:border-none"
                    >
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                        className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-pix-gold transition-all object-cover"
                        alt=""
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-white group-hover:text-pix-gold transition-colors">@{u.username}</span>
                        <span className="text-[10px] text-pix-gray truncate">{u.bio || "PixShare Creator"}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-[10px] text-pix-gray uppercase tracking-widest font-black">No creators found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-6">
          <Link to="/explore" className="p-2 text-pix-gray hover:text-pix-gold transition-all hover:scale-110 flex items-center gap-2">
            <Compass size={24} strokeWidth={1.5} />
            <span className="hidden lg:inline text-[10px] font-black uppercase tracking-[2px]">Explore</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3 sm:gap-5 border-l border-white/10 pl-5">
              <Link to="/create" className="bg-pix-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition transform active:scale-95 shadow-lg shadow-blue-500/20 uppercase tracking-wider">
                <PlusSquare size={18} />
                <span className="hidden sm:inline">Post</span>
              </Link>

              <div className="group relative">
                <button className="flex items-center gap-2 p-0.5 rounded-full hover:bg-white/5 transition">
                  <div className="w-10 h-10 rounded-full border-2 border-pix-gold p-0.5 transition-transform group-hover:scale-105">
                    <img
                      src={user.avatar}
                      className="w-full h-full rounded-full object-cover bg-pix-dark"
                      alt="profile"
                    />
                  </div>
                  <ChevronDown size={14} className="text-pix-gray group-hover:text-white transition-transform group-hover:rotate-180" />
                </button>

                {/* Profile Dropdown (Sửa lỗi hover nhạy) */}
                <div className="absolute top-full right-0 pt-2 w-52 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none group-hover:pointer-events-auto z-50">
                  <div className="bg-pix-dark border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02] mb-1">
                      <p className="text-[9px] text-pix-gray uppercase font-black tracking-[2px]">Identity</p>
                      <p className="text-sm font-bold text-pix-gold truncate">@{user.username}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-5 py-3 text-sm text-pix-gray hover:text-white hover:bg-white/5 transition-colors">
                      <User size={16} /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors mt-1 border-t border-white/5">
                      <LogOut size={16} /> Exit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-pix-gold hover:bg-yellow-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] shadow-lg shadow-pix-gold/20 transition transform active:scale-95">
              Access
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}