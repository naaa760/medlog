const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: Array,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topics: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
    },
    summary: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
