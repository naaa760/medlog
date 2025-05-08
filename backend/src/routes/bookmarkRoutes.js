const express = require("express");
const {
  getBookmarks,
  toggleBookmark,
} = require("../controllers/bookmarkController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Protected routes
router.get("/", auth, getBookmarks);
router.post("/toggle", auth, toggleBookmark);

module.exports = router;
