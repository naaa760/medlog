const express = require("express");
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Public route - Get comments for a post
router.get("/", getComments);

// Protected routes
router.post("/", auth, createComment);
router.patch("/:id", auth, updateComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;
