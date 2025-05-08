const { prisma } = require("../lib/prisma");

// Get all tags
const getTags = async (req, res) => {
  try {
    const { popular } = req.query;

    if (popular === "true") {
      // Get most popular tags (with most posts)
      const tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          posts: {
            _count: "desc",
          },
        },
        take: 10,
      });

      return res.status(200).json(tags);
    } else {
      // Get all tags alphabetically
      const tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      return res.status(200).json(tags);
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
    return res.status(500).json({
      message: "Failed to fetch tags",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get tag by slug
const getTagBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res.status(200).json(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    return res.status(500).json({
      message: "Failed to fetch tag",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

module.exports = {
  getTags,
  getTagBySlug,
};
