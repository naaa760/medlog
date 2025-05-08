const { prisma } = require("../lib/prisma");
const { toggleFollowSchema } = require("../utils/validations");

// Toggle follow for a user
const toggleFollow = async (req, res) => {
  try {
    // Validate request body
    const validationResult = toggleFollowSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationResult.error.format(),
      });
    }

    const { userId } = validationResult.data;

    // Prevent self-follow
    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId: userId,
        },
      },
    });

    // If already following, unfollow
    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: req.user.id,
            followingId: userId,
          },
        },
      });

      return res.status(200).json({ following: false });
    } else {
      // Follow user
      await prisma.follow.create({
        data: {
          followerId: req.user.id,
          followingId: userId,
        },
      });

      return res.status(200).json({ following: true });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    return res.status(500).json({
      message: "Failed to toggle follow",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get followers/following
const getFollows = async (req, res) => {
  try {
    const { userId, type = "followers" } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (type === "followers") {
      // Get users who follow this user
      const followers = await prisma.follow.findMany({
        where: {
          followingId: userId,
        },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              bio: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(followers.map((f) => f.follower));
    } else if (type === "following") {
      // Get users this user follows
      const following = await prisma.follow.findMany({
        where: {
          followerId: userId,
        },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              bio: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(following.map((f) => f.following));
    } else {
      return res.status(400).json({ message: "Invalid type parameter" });
    }
  } catch (error) {
    console.error("Error fetching follows:", error);
    return res.status(500).json({
      message: "Failed to fetch follows",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

module.exports = {
  toggleFollow,
  getFollows,
};
