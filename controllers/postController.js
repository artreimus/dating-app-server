import Post from '../models/post.js';
import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';
import { BadRequestError } from '../errors/index.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPost = asyncHandler(async (req, res) => {
  const { photoId } = req.body;

  const post = await Post.findById(photoId);
  res.status(200).json({ success: true, data: post });
});

const createPost = asyncHandler(async (req, res) => {
  const { photo } = req.body;

  if (!photo) {
    throw new BadRequestError('Please provide image');
  }

  const photoUrl = await cloudinary.uploader.upload(photo, {
    timeout: 180000,
    use_filename: false,
    public_id: `${Math.random().toString(36).substring(2, 7)}`,
    folder: `dating-app`,
  });

  if (!photoUrl) {
    throw new BadRequestError(
      'An error was encountered while saving the image'
    );
  }

  const newPost = await Post.create({
    photo: photoUrl.url,
  });

  if (!newPost) {
    throw new BadRequestError('An error was encountered while saving the post');
  }

  res.status(201).json({ success: true, data: newPost });
});

export { getPost, createPost };
