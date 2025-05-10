const Article = require("../models/Article");

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new article
exports.createArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    const savedArticle = await article.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
