const { prisma } = require("../lib/prisma");
const { searchSchema } = require("../utils/validations");

// Search posts, users or tags
const search = async (req, res) => {
  try {
    const { query, type = "posts" } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Validate query parameters
    const validationResult = searchSchema.safeParse({ query, type });
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationResult.error.format(),
      });
    }

    const searchTerm = validationResult.data.query;

    if (type === "posts") {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { subtitle: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
            {
              tags: {
                some: {
                  tag: {
                    name: { contains: searchTerm, mode: "insensitive" },
                  },
                },
              },
            },
          ],
          published: true,
        },
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
        take: 20,
      });

      return res.status(200).json(posts);
    } else if (type === "users") {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { username: { contains: searchTerm, mode: "insensitive" } },
            { bio: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          _count: {
            select: {
              posts: { where: { published: true } },
              followedBy: true,
              following: true,
            },
          },
        },
        take: 20,
      });

      return res.status(200).json(users);
    } else if (type === "tags") {
      const tags = await prisma.tag.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { slug: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        take: 20,
      });

      return res.status(200).json(tags);
    }

    return res.status(400).json({ message: "Invalid search type" });
  } catch (error) {
    console.error("Error searching:", error);
    return res.status(500).json({
      message: "Search failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

module.exports = {
  search,
};
