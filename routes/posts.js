// routes/posts.js
const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPost,     
  updatePost,
  deletePost,
} = require("../controllers/posts");

const {
  createPostSchema,
  updatePostPutSchema,
  updatePostSchema,
} = require("../utilts/validarion/post");

const validate = require("../middlewares/validate");
const { uploadCDN } = require("../middlewares/multer-upload");
const uploadImageKit = require("../middlewares/uplaodImageKit");

// Create Post
router.post(
  "/",
  uploadCDN.single("image"),
  uploadImageKit(false),
  validate(createPostSchema),
  createPost
);

// Update Post (PUT)
router.put(
  "/:id",
  uploadCDN.single("image"),
  uploadImageKit(false),
  validate(updatePostPutSchema),
  updatePost
);

// Update Post (PATCH)
router.patch(
  "/:id",
  uploadCDN.single("image"),
  uploadImageKit(false),
  validate(updatePostSchema),
  updatePost
);

// Get All Posts
router.get("/", getAllPosts);

// Get Post by ID
router.get("/:id", getPost);

// Delete Post
router.delete("/:id", deletePost);

module.exports = router;
