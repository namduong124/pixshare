import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.signIn(formData);
            login(data);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Login failed! Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-pix-black">
            <div className="flex w-full max-w-5xl bg-pix-dark rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">

                {/* Cột trái: Ảnh minh họa (Grayscale Aesthetic) */}
                <div className="hidden lg:block w-1/2 relative">
                    <img
                        src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
                        className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
                        alt="login-visual"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pix-black via-transparent to-transparent flex flex-col justify-end p-12">
                        <h1 className="text-4xl font-light italic text-pix-gold mb-2 tracking-tighter">
                            "Light is everything."
                        </h1>
                        <p className="text-pix-gray text-[10px] uppercase tracking-[0.3em]">
                            PixShare Curator Collective
                        </p>
                    </div>
                </div>

                {/* Cột phải: Form đăng nhập */}
                <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold mb-3 tracking-tight text-white">Welcome back</h2>
                        <p className="text-pix-gray text-sm">Enter your gallery to continue the journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Input Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-pix-gold font-bold ml-1">
                                Email / Account
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pix-gray group-focus-within:text-pix-gold transition" size={18} />
                                <input
                                    type="email"
                                    required
                                    placeholder="artist@pixshare.com"
                                    className="w-full bg-pix-black border border-white/5 rounded-2xl pl-12 pr-4 py-4 focus:border-pix-gold/50 outline-none text-sm transition text-white placeholder:text-pix-gray/30"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-pix-gold font-bold ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pix-gray group-focus-within:text-pix-gold transition" size={18} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-pix-black border border-white/5 rounded-2xl pl-12 pr-4 py-4 focus:border-pix-gold/50 outline-none text-sm transition text-white placeholder:text-pix-gray/30"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Nút Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pix-blue hover:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-blue-900/20 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Authorize Access
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* PHẦN QUAN TRỌNG: Link sang đăng ký */}
                    <div className="mt-12 text-center text-sm">
                        <span className="text-pix-gray">New to the community? </span>
                        <Link
                            to="/register"
                            className="text-pix-gold font-bold hover:underline decoration-2 underline-offset-8 ml-1 transition-all"
                        >
                            Join for free
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}