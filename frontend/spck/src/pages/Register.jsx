import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import * as api from '../api';

export default function Register() {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      await api.signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      alert("Registration successful! Now please login.");
      navigate('/login'); 
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-pix-black">
      <div className="flex flex-row-reverse w-full max-w-5xl bg-pix-dark rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
        
        {/* Cột ảnh (Đổi sang bên phải cho khác biệt với Login) */}
        <div className="hidden lg:block w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1554147090-e1221a247125" 
            className="w-full h-full object-cover brightness-50" 
            alt="register-visual"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-12">
             <div className="border-l-2 border-pix-gold pl-6">
                <h2 className="text-3xl font-light italic text-white mb-4">"Every artist was first an amateur."</h2>
                <p className="text-pix-gold text-xs uppercase tracking-widest">— Ralph Waldo Emerson</p>
             </div>
          </div>
        </div>

        {/* Cột Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-pix-gray hover:text-white mb-8 transition text-xs uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Login
          </button>

          <h2 className="text-4xl font-bold mb-8 tracking-tight text-white">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-pix-gold font-bold">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pix-gray" size={18} />
                <input 
                  type="text" required placeholder="your_name"
                  className="w-full bg-pix-black border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 focus:border-pix-gold/50 outline-none text-sm text-white transition"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-pix-gold font-bold">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pix-gray" size={18} />
                <input 
                  type="email" required placeholder="art@pixshare.com"
                  className="w-full bg-pix-black border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 focus:border-pix-gold/50 outline-none text-sm text-white transition"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-pix-gold font-bold">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pix-gray" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full bg-pix-black border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 focus:border-pix-gold/50 outline-none text-sm text-white transition"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-pix-gold font-bold">Confirm Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-pix-gray" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full bg-pix-black border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 focus:border-pix-gold/50 outline-none text-sm text-white transition"
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-pix-gold text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Join Collective'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}