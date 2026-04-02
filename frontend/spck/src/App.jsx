import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import { AuthProvider, useAuth } from './context/AuthContext';
import Explore from './pages/Explore';
import Profile from './pages/Profile';


const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-pix-black text-white">
          <Navbar />

          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />

            {/* 2. Trang Đăng Bài (Yêu cầu đăng nhập) */}
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              }
            />

            {/* 3. Trang Đăng Nhập */}
            <Route path="/login" element={<Login />} />

            {/* 4. Trang Đăng Ký (Đây chính là trang bạn đang thiếu) */}
            <Route path="/register" element={<Register />} />

            {/* 5. Route dự phòng (Nếu gõ bừa link thì về Home) */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;