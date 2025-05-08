const { prisma } = require("../lib/prisma");
const { updateUserSchema } = require("../utils/validations");

// Get user by username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            posts: { where: { published: true } },
            followedBy: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current user is following this user
    let isFollowing = false;

    if (req.user) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: req.user.id,
            followingId: user.id,
          },
        },
      });

      isFollowing = !!follow;
    }

    return res.status(200).json({
      ...user,
      isFollowing,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      message: "Failed to fetch user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update current user profile
const updateCurrentUser = async (req, res) => {
  try {
    // Validate request body
    const validationResult = updateUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationResult.error.format(),
      });
    }

    const userData = validationResult.data;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: userData,
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle unique constraint violation
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "This username is already taken",
        field: "username",
      });
    }

    return res.status(500).json({
      message: "Failed to update user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get user posts
const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const { published = "true", limit = "10", page = "1" } = req.query;

    const isPublished = published === "true";
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Find user first
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build where clause
    let whereClause = {
      authorId: user.id,
    };

    // Only include published posts, unless the request is from the post owner
    if (isPublished || user.id !== req.user?.id) {
      whereClause.published = true;
    }

    // Get posts
    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
            claps: true,
            bookmarks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limitNum,
      skip: skip,
    });

    // Get total count for pagination
    const totalPosts = await prisma.post.count({
      where: whereClause,
    });

    return res.status(200).json({
      data: posts,
      meta: {
        total: totalPosts,
        page: pageNum,
        pageSize: limitNum,
        pageCount: Math.ceil(totalPosts / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(500).json({
      message: "Failed to fetch user posts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

module.exports = {
  getUserByUsername,
  updateCurrentUser,
  getUserPosts,
};
