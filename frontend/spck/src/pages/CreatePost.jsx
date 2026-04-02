import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Users, Info, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import * as api from '../api';

export default function CreatePost() {
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [files, setFiles] = useState([]); // Mảng các file thực tế
    const [previews, setPreviews] = useState([]); // Mảng các URL để hiển thị
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const fileRef = useRef();


    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);


        if (files.length + selectedFiles.length > 5) {
            return alert("Maximum 5 images allowed");
        }

        const newFiles = [...files, ...selectedFiles];
        setFiles(newFiles);


        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };


    const removeImage = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        setPreviews(updatedPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) return alert("Please select at least one image!");

        setLoading(true);
        const formData = new FormData();

        files.forEach(file => {
            formData.append('images', file);
        });
        formData.append('caption', caption);
        formData.append('location', location);

        try {
            await api.createPost(formData);
            navigate('/');
        } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="bg-pix-dark rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

                {/* HEADER */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-pix-dark/50">
                    <button onClick={() => navigate(-1)} className="text-pix-gray hover:text-white transition"><X size={24} /></button>
                    <h2 className="font-bold tracking-tight text-pix-gold uppercase text-xs">New Masterpiece</h2>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || files.length === 0}
                        className="bg-pix-gold text-black px-6 py-2 rounded-full text-sm font-black hover:scale-105 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Share'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row min-h-[550px]">
                    {/* LEFT: IMAGE UPLOAD AREA */}
                    <div className="w-full lg:w-[60%] bg-black flex flex-col items-center justify-center p-6 border-r border-white/5">
                        {previews.length > 0 ? (
                            <div className="w-full space-y-4">
                                {/* Main Preview (Ảnh đầu tiên to nhất) */}
                                <div className="relative aspect-square w-full max-h-[400px] bg-pix-black rounded-2xl overflow-hidden border border-white/10">
                                    <img src={previews[0]} className="w-full h-full object-contain" alt="main-preview" />
                                    <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest"> Cover Image </div>
                                </div>

                                {/* Thumbnail Grid */}
                                <div className="grid grid-cols-5 gap-2">
                                    {previews.map((url, i) => (
                                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/20 group">
                                            <img src={url} className="w-full h-full object-cover" alt="" />
                                            <button onClick={() => removeImage(i)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X size={16} className="text-white" />
                                            </button>
                                        </div>
                                    ))}
                                    {previews.length < 5 && (
                                        <button onClick={() => fileRef.current.click()} className="aspect-square rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-pix-gray hover:text-pix-gold hover:border-pix-gold/50 transition">
                                            <Plus size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileRef.current.click()}
                                className="w-full h-[400px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-pix-gold/50 hover:bg-white/5 cursor-pointer transition group"
                            >
                                <div className="w-16 h-16 rounded-full bg-pix-dark flex items-center justify-center group-hover:scale-110 transition border border-white/5">
                                    <ImageIcon size={32} className="text-pix-gray group-hover:text-pix-gold" />
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-bold text-sm">Select up to 5 photos</p>
                                    <p className="text-[10px] text-pix-gray uppercase tracking-widest mt-1">High resolution preferred</p>
                                </div>
                            </div>
                        )}
                        <input type="file" ref={fileRef} className="hidden" onChange={handleImageChange} accept="image/*" multiple />
                    </div>

                    {/* RIGHT: DETAILS AREA */}
                    <div className="w-full lg:w-[40%] p-8 space-y-8 bg-pix-dark/30">
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write a caption..."
                            className="w-full bg-transparent border-none outline-none text-base resize-none h-40 placeholder:text-pix-gray/40 text-white"
                        ></textarea>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-pix-black/40 rounded-2xl border border-white/5 focus-within:border-pix-gold/50 transition">
                                <MapPin size={20} className="text-pix-gold" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Add location"
                                    className="bg-transparent border-none outline-none text-sm w-full text-white"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-pix-gold/5 rounded-2xl border border-pix-gold/10 flex gap-3">
                            <Info size={18} className="text-pix-gold shrink-0" />
                            <p className="text-[10px] text-pix-gray leading-relaxed uppercase font-medium">
                                Carousel posts allow users to swipe through your art. Make sure the first image is your best!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}