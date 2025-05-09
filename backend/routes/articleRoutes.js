const express = require("express");
const router = express.Router();
const {
  createArticle,
  getArticles,
  getMyArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  clapArticle,
} = require("../controllers/articleController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getArticles);
router.get("/:id", getArticleById);

// Protected routes
router.post("/", protect, createArticle);
router.get("/user/myarticles", protect, getMyArticles);
router.put("/:id", protect, updateArticle);
router.delete("/:id", protect, deleteArticle);
router.put("/:id/clap", protect, clapArticle);

module.exports = router;
