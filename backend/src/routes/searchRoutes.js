const express = require("express");
const { search } = require("../controllers/searchController");

const router = express.Router();

// Public route
router.get("/", search);

module.exports = router;
