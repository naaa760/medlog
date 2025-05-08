const express = require("express");
const {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Public route - Get all posts
router.get("/", getPosts);

// Public route - Get a post by slug
router.get("/:slug", getPostBySlug);

// Protected routes
router.post("/", auth, createPost);
router.patch("/:slug", auth, updatePost);
router.delete("/:slug", auth, deletePost);

module.exports = router;
