const Post = require("../models/Post");
const AppError = require("../utilts/AppError");

// Create Post
const createPost = async (req, res, next) => {
  try {
    // الصورة من ImageKit
    let imageUrl;
    if (req.images && req.images.length > 0) {
      imageUrl = req.images[0]; // أول صورة مرفوعة
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      user: req.body.user,
      imageUrl: imageUrl,
    });

    await newPost.save();
    res.status(201).json({ status: "success", data: newPost });
  } catch (err) {
    next(err);
  }
};

// Update Post
const updatePost = async (req, res, next) => {
  try {
    let imageUrl = req.body.imageUrl; // default
    if (req.images && req.images.length > 0) {
      imageUrl = req.images[0];
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        user: req.body.user,
        imageUrl: imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) return next(new AppError("Post not found", 404));

    res.status(200).json({ status: "success", data: updatedPost });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPosts: async (req, res, next) => {
    try {
      const posts = await Post.find().populate("user", "name email");
      res.status(200).json({ status: "success", data: posts });
    } catch (err) {
      next(err);
    }
  },
  getPost: async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id).populate("user", "name email");
      if (!post) return next(new AppError("Post not found", 404));
      res.status(200).json({ status: "success", data: post });
    } catch (err) {
      next(err);
    }
  },
  createPost,
  updatePost,
  deletePost: async (req, res, next) => {
    try {
      const deletedPost = await Post.findByIdAndDelete(req.params.id);
      if (!deletedPost) return next(new AppError("Post not found", 404));
      res.status(200).json({ status: "success", message: "Post deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};
