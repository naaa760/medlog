// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Handle different types of errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues,
    });
  }

  if (err.name === "PrismaClientKnownRequestError") {
    // Handle common Prisma errors
    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Unique constraint violation",
        field: err.meta?.target,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "Record not found",
      });
    }
  }

  // Default server error
  res.status(500).json({
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = { errorHandler };
