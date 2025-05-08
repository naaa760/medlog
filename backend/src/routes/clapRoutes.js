const express = require("express");
const { toggleClap } = require("../controllers/clapController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Protected routes
router.post("/toggle", auth, toggleClap);

module.exports = router;
