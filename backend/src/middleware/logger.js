// Logging middleware
const logger = (req, res, next) => {
  const start = Date.now();

  // Log when the request completes
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} ${
        res.statusCode
      } - ${duration}ms`
    );
  });

  next();
};

module.exports = { logger };
