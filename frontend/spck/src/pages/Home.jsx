import { useEffect, useState } from 'react';
import axios from 'axios';
import PhotoCard from '../components/PhotoCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('https://pixshare-29aw.onrender.com/api/posts');
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-20 text-pix-gold">Loading art...</div>;

  return (
    <div className="max-w-[470px] mx-auto py-8">
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <PhotoCard key={post._id} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <p className="text-center text-pix-gray mt-10 italic">No one has shared anything yet.</p>
      )}
    </div>
  );
}