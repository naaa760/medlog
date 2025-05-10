const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Routes
const articleRoutes = require("./routes/articles");
const userRoutes = require("./routes/users");

// Environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Database connection error:", err));

// Vercel serverless function needs to export the Express app
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
