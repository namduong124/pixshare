import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  imageUrls: { 
    type: [String], 
    required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 10'] 
  },

  caption: { 
    type: String, 
    default: '' 
  },

  location: { 
    type: String, 
    default: 'Global' 
  },


  likes: { 
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'User', 
    default: [] 
  },

  comments: [
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
      },
      username: { 
        type: String, 
        required: true 
      },
      text: { 
        type: String, 
        required: true 
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      }
    }
  ],
}, { 
  timestamps: true 
});

function arrayLimit(val) {
  return val.length <= 10;
}

const Post = mongoose.model('Post', postSchema);

export default Post;