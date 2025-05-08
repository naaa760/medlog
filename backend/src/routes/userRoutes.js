const express = require("express");
const {
  getUserByUsername,
  updateCurrentUser,
  getUserPosts,
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Public route - Get user by username
router.get("/:username", getUserByUsername);

// Get user posts
router.get("/:username/posts", getUserPosts);

// Protected routes
router.patch("/me", auth, updateCurrentUser);

module.exports = router;
