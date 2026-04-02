import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});


export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }
    const uploadSingleFile = (file) => {
      return new Promise((resolve, reject) => {
        const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        cloudinary.uploader.upload(
          fileBase64, 
          { folder: 'pixshare_posts' }, 
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
      });
    };

    const imageUrls = await Promise.all(req.files.map(file => uploadSingleFile(file)));
    req.body.imageUrls = imageUrls;
    next();
  } catch (error) {
    console.error("Cloudinary Multi-Upload Error:", error);
    res.status(500).json({ message: "Failed to upload images to Cloudinary" });
  }
};

export default upload;