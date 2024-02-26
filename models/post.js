import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  photo: { type: String, required: true },
});

export default mongoose.model('Post', PostSchema);
