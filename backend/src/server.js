const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
// Import prisma from the dedicated file instead
const { prisma } = require("./lib/prisma");

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const clapRoutes = require("./routes/clapRoutes");
const followRoutes = require("./routes/followRoutes");
const tagRoutes = require("./routes/tagRoutes");
const searchRoutes = require("./routes/searchRoutes");

// Import middleware
const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./middleware/logger");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/claps", clapRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/search", searchRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database connection closed");
  process.exit(0);
});
