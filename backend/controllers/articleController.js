const Article = require("../models/Article");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc    Create a new article
// @route   POST /api/articles
// @access  Private
const createArticle = asyncHandler(async (req, res) => {
  const { title, content, excerpt, blocks, readTime } = req.body;

  if (!title || !content || !blocks) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // Create article
  const article = await Article.create({
    title,
    content,
    excerpt: excerpt || content.substring(0, 150),
    blocks,
    author: req.user._id,
    readTime: readTime || "5 min read",
  });

  const populatedArticle = await Article.findById(article._id).populate(
    "author",
    "firstName lastName username imageUrl"
  );

  if (populatedArticle) {
    res.status(201).json(populatedArticle);
  } else {
    res.status(400);
    throw new Error("Invalid article data");
  }
});

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: "i" } },
          { content: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {};

  const count = await Article.countDocuments({ ...keyword });
  const articles = await Article.find({ ...keyword })
    .populate("author", "firstName lastName username imageUrl")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    articles,
    page,
    pages: Math.ceil(count / pageSize),
    totalArticles: count,
  });
});

// @desc    Get user's articles
// @route   GET /api/articles/myarticles
// @access  Private
const getMyArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find({ author: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(articles);
});

// @desc    Get article by ID
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id).populate(
    "author",
    "firstName lastName username imageUrl bio"
  );

  if (article) {
    res.json(article);
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private
const updateArticle = asyncHandler(async (req, res) => {
  const { title, content, excerpt, blocks, readTime, isPinned } = req.body;

  const article = await Article.findById(req.params.id);

  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  // Check if the user is the author of the article
  if (article.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to update this article");
  }

  article.title = title || article.title;
  article.content = content || article.content;
  article.excerpt = excerpt || article.excerpt;
  article.blocks = blocks || article.blocks;
  article.readTime = readTime || article.readTime;

  if (isPinned !== undefined) {
    article.isPinned = isPinned;
  }

  const updatedArticle = await article.save();
  res.json(updatedArticle);
});

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private
const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  // Check if the user is the author of the article
  if (article.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to delete this article");
  }

  await article.remove();
  res.json({ message: "Article removed" });
});

// @desc    Clap for an article
// @route   PUT /api/articles/:id/clap
// @access  Private
const clapArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  article.claps = article.claps + 1;
  await article.save();

  res.json({ claps: article.claps });
});

module.exports = {
  createArticle,
  getArticles,
  getMyArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  clapArticle,
};
