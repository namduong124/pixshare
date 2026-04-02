import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // 1. Lấy token từ Header (Authorization: Bearer <token>)
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy Token. Truy cập bị từ chối!" });
    }
    const isCustomAuth = token.length < 500; 

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decodedData?.id,
        username: decodedData?.username
      };
      req.userId = decodedData?.id; 
      req.username = decodedData?.username;

    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
      req.user = { id: decodedData?.sub, username: decodedData?.name };
    }

    next(); 
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};