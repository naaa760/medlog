import api from "./api";

// Get all articles
export const fetchArticles = async (page = 1) => {
  try {
    const response = await api.get(`/articles?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
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
