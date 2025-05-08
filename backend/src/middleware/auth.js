const { prisma } = require("../lib/prisma");
const { verify } = require("@clerk/backend");

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    // Verify token with Clerk
    const { sub: userId } = await verify(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user to request for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = { auth };
