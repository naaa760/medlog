const express = require("express");
const { getFollows, toggleFollow } = require("../controllers/followController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Protected routes
router.get("/", auth, getFollows);
router.post("/toggle", auth, toggleFollow);

module.exports = router;
