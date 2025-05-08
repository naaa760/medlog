const { z } = require("zod");

// Post validation schemas
const createPostSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  subtitle: z
    .string()
    .max(150, "Subtitle cannot exceed 150 characters")
    .optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z.string().url("Cover image must be a valid URL").optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

const updatePostSchema = createPostSchema.partial();

// Comment validation schemas
const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
  postId: z.string(),
  parentId: z.string().optional(),
});

const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
});

// User validation schemas
const updateUserSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  username: z.string().min(3).max(20).optional(),
  bio: z.string().max(160).optional(),
  image: z.string().url().optional(),
});

// Other validation schemas
const toggleBookmarkSchema = z.object({
  postId: z.string(),
});

const toggleClapSchema = z.object({
  postId: z.string(),
  count: z
    .number()
    .min(1, "Clap count must be at least 1")
    .max(50, "Cannot clap more than 50 times")
    .default(1),
});

const toggleFollowSchema = z.object({
  userId: z.string(),
});

const searchSchema = z.object({
  query: z.string().min(1, "Search query cannot be empty"),
  type: z.enum(["posts", "users", "tags"]).default("posts"),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  updateCommentSchema,
  updateUserSchema,
  toggleBookmarkSchema,
  toggleClapSchema,
  toggleFollowSchema,
  searchSchema,
};
