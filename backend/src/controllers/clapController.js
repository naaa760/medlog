const { prisma } = require("../lib/prisma");
const { toggleClapSchema } = require("../utils/validations");

// Toggle clap for a post
const toggleClap = async (req, res) => {
  try {
    // Validate request body
    const validationResult = toggleClapSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationResult.error.format(),
      });
    }

    const { postId, count = 1 } = validationResult.data;

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if clap already exists
    const existingClap = await prisma.clap.findUnique({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId,
        },
      },
    });

    // If clap exists, update the count
    if (existingClap) {
      const updatedClap = await prisma.clap.update({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId,
          },
        },
        data: {
          count: existingClap.count + count,
        },
      });

      return res.status(200).json({ clapCount: updatedClap.count });
    } else {
      // Create new clap
      const newClap = await prisma.clap.create({
        data: {
          userId: req.user.id,
          postId,
          count,
        },
      });

      return res.status(200).json({ clapCount: newClap.count });
    }
  } catch (error) {
    console.error("Error updating claps:", error);
    return res.status(500).json({
      message: "Failed to update claps",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

module.exports = {
  toggleClap,
};
