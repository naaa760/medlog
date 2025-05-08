const { prisma } = require("../lib/prisma");
const {
  createCommentSchema,
  updateCommentSchema,
} = require("../utils/validations");

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Get all comments for the post
    const comments = await prisma.comment.findMany({
      where: {
        postId,
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
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "Failed to fetch comments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    // Validate request body
    const validationResult = createCommentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationResult.error.format(),
      });
    }

    const { content, postId, parentId } = validationResult.data;

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // If parentId is provided, verify parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        parentId,
        authorId: req.user.id,
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
      },
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({
      message: "Failed to create comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const validationResult = updateCommentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationResult.error.format(),
      });
    }

    const { content } = validationResult.data;

    // Get the comment
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({
      message: "Failed to update comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      message: "Failed to delete comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
