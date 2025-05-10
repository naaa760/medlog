import api from "./api";

// Use the environment variable for API calls
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Get all articles
export const fetchArticles = async (page = 1) => {
  const response = await fetch(`${API_URL}/api/articles?page=${page}`);
  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  return response.json();
};

// Get article by ID
export const fetchArticleById = async (id) => {
  try {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
};

// Create new article
export const createArticle = async (articleData) => {
  try {
    const response = await api.post("/articles", articleData);
    return response.data;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};

// Update existing article
export const updateArticle = async (id, articleData) => {
  try {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

// Delete article
export const deleteArticle = async (id) => {
  try {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

// Clap for article
export const clapForArticle = async (id) => {
  try {
    const response = await api.put(`/articles/${id}/clap`);
    return response.data;
  } catch (error) {
    console.error("Error clapping for article:", error);
    throw error;
  }
};
