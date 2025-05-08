const { prisma } = require("../lib/prisma");
const { toggleBookmarkSchema } = require("../utils/validations");

// Get bookmarks for the current user
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        post: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to only return posts with bookmark info
    const bookmarkedPosts = bookmarks.map((bookmark) => ({
      ...bookmark.post,
      bookmarkedAt: bookmark.createdAt,
    }));

    return res.status(200).json(bookmarkedPosts);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return res.status(500).json({
      message: "Failed to fetch bookmarks",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Toggle bookmark for a post
const toggleBookmark = async (req, res) => {
  try {
    // Validate request body
    const validationResult = toggleBookmarkSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationResult.error.format(),
      });
    }

    const { postId } = validationResult.data;

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId,
        },
      },
    });

    // If bookmark exists, remove it
    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId,
          },
        },
      });

      return res.status(200).json({ bookmarked: false });
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId: req.user.id,
          postId,
        },
      });

      return res.status(200).json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return res.status(500).json({
      message: "Failed to toggle bookmark",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

module.exports = {
  getBookmarks,
  toggleBookmark,
};
