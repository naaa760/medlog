const { prisma } = require("../lib/prisma");
const { createPostSchema, updatePostSchema } = require("../utils/validations");
const slugify = require("slugify");

// Get all posts with filtering
const getPosts = async (req, res) => {
  try {
    const { tag, author, limit = "10", page = "1" } = req.query;

    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for filtering
    let whereClause = {
      published: true,
    };

    if (tag) {
      whereClause.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    if (author) {
      whereClause.author = {
        username: author,
      };
    }

    // Execute the query
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
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      message: "Failed to fetch posts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get a single post by slug
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
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
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if post is published or if the user is the author
    if (!post.published && post.authorId !== req.user?.id) {
      return res.status(403).json({ message: "This post is not available" });
    }

    // Check user's bookmark and clap status
    let isBookmarked = false;
    let userClaps = 0;

    if (req.user) {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId: post.id,
          },
        },
      });

      isBookmarked = !!bookmark;

      const clap = await prisma.clap.findUnique({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId: post.id,
          },
        },
      });

      userClaps = clap ? clap.count : 0;
    }

    return res.status(200).json({
      ...post,
      userReactions: {
        isBookmarked,
        userClaps,
      },
    });
  } catch (error) {
    console.error(`Error fetching post:`, error);
    return res.status(500).json({
      message: "Failed to fetch post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create a new post
const createPost = async (req, res) => {
  try {
    // Validate request body
    const validationResult = createPostSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationResult.error.format(),
      });
    }

    const { tags = [], ...postData } = validationResult.data;

    // Generate a unique slug
    let slug = slugify(postData.title, { lower: true });
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create post with tags in a transaction
    const post = await prisma.$transaction(async (tx) => {
      // Create post
      const newPost = await tx.post.create({
        data: {
          ...postData,
          slug,
          authorId: req.user.id,
        },
      });

      // Add tags
      if (tags.length > 0) {
        for (const tagName of tags) {
          // Find or create tag
          let tag = await tx.tag.findUnique({
            where: { name: tagName },
          });

          if (!tag) {
            tag = await tx.tag.create({
              data: {
                name: tagName,
                slug: slugify(tagName, { lower: true }),
              },
            });
          }

          // Create post-tag relation
          await tx.postTag.create({
            data: {
              postId: newPost.id,
              tagId: tag.id,
            },
          });
        }
      }

      return newPost;
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      message: "Failed to create post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update an existing post
const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;

    // Get the post
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    // Validate request body
    const validationResult = updatePostSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationResult.error.format(),
      });
    }

    const { tags, ...postData } = validationResult.data;

    // Update slug if title is changed
    if (postData.title && postData.title !== post.title) {
      let newSlug = slugify(postData.title, { lower: true });
      const existingPost = await prisma.post.findUnique({
        where: {
          slug: newSlug,
          NOT: {
            id: post.id,
          },
        },
      });

      if (existingPost) {
        newSlug = `${newSlug}-${Date.now()}`;
      }

      postData.slug = newSlug;
    }

    // Update post with tags in a transaction
    const updatedPost = await prisma.$transaction(async (tx) => {
      // Update post
      const updated = await tx.post.update({
        where: { id: post.id },
        data: postData,
      });

      // Update tags if provided
      if (tags) {
        // Remove existing tags
        await tx.postTag.deleteMany({
          where: { postId: post.id },
        });

        // Add new tags
        for (const tagName of tags) {
          // Find or create tag
          let tag = await tx.tag.findUnique({
            where: { name: tagName },
          });

          if (!tag) {
            tag = await tx.tag.create({
              data: {
                name: tagName,
                slug: slugify(tagName, { lower: true }),
              },
            });
          }

          // Create post-tag relation
          await tx.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id,
            },
          });
        }
      }

      return updated;
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({
      message: "Failed to update post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { slug } = req.params;

    // Get the post
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: post.id },
    });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      message: "Failed to delete post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

module.exports = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
};
