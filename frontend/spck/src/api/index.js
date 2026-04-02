import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:10000/api' });

// 2. Interceptor: Tự động đính kèm Token vào TẤT CẢ các request
API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    const token = JSON.parse(profile).token;
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const signIn = (formData) => API.post('/auth/login', formData);
export const signUp = (formData) => API.post('/auth/register', formData);

export const fetchPosts = () => API.get('/posts');

export const createPost = (newPost) => API.post('/posts', newPost, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

export const commentPost = (text, id) => API.post(`/posts/${id}/commentPost`, { text });


export const fetchUserById = (id) => API.get(`/users/${id}`);

export const updateProfile = (formData) => API.patch('/users/profile', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const searchUsers = (query) => API.get(`/users/search?query=${query}`);

export default API;