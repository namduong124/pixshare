import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ verifyToken middleware
    const { username, bio, website } = req.body; 

    let updateData = { username, bio, website };
    if (req.body.image) {
      updateData.avatar = req.body.image; 
    }


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { returnDocument: 'after' } 
    ).select('-password'); 

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchUsers = async (req, res) => {
    const { query } = req.query; 

    try {
        if (!query) return res.status(200).json([]);
        const users = await User.find({
            username: { $regex: query, $options: 'i' }
        }).select('username avatar bio');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};