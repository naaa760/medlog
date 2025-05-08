const express = require("express");
const { getTags, getTagBySlug } = require("../controllers/tagController");

const router = express.Router();

// Public routes
router.get("/", getTags);
router.get("/:slug", getTagBySlug);

module.exports = router;
