const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  followUser,
  unfollowUser,
  syncUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.route("/:id").get(getUserById);
router.put("/:id/follow", protect, followUser);
router.put("/:id/unfollow", protect, unfollowUser);

// Add this with the other routes
router.post("/sync", syncUser);

module.exports = router;
