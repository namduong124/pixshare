import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import upload, { uploadToCloudinary } from '../middleware/cloudinary.js';
import { getUserById, searchUsers, updateProfile } from '../controllers/users.js';

const router = express.Router();
router.get('/search', searchUsers);


router.patch(
  '/profile', 
  verifyToken, 
  upload.single('avatar'), 
  uploadToCloudinary,     
  updateProfile
);
router.get('/:id', getUserById);
export default router;