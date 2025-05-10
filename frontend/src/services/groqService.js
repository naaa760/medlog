import { useState, useEffect } from "react";

// Configuration - replace with your actual API key when deploying
const GROQ_API_KEY =
  process.env.NEXT_PUBLIC_GROQ_API_KEY ||
  process.env.GROQ_API_KEY ||
  "your-api-key-here";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Calls the Groq API to generate content based on the provided prompt
 * @param {string} prompt - The prompt to send to Groq
 * @param {string} model - The model to use (default: "llama3-8b-8192")
 * @returns {Promise<string>} - The generated content
 */
export async function generateWithGroq(prompt, model = "llama3-8b-8192") {
  // Check if API key is configured
  if (!GROQ_API_KEY || GROQ_API_KEY === "your-api-key-here") {
    console.warn(
      "Groq API key not configured. Please add your API key to .env.local"
    );
    return "API key not configured. Please add your Groq API key to use AI features.";
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant specializing in writing and content creation.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      throw new Error(
        `Groq API error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating content with Groq:", error);
    // Return a user-friendly message
    return "Sorry, there was an error generating content. Please try again later.";
  }
}

/**
 * Generate a summary of the provided article content
 * @param {string} content - The article content to summarize
 * @returns {Promise<string>} - The generated summary
 */
export async function generateSummary(content) {
  const prompt = `
    Please generate a concise, engaging summary (3-4 sentences) for the following article content.
    Focus on the main points and keep the tone similar to the original.
    
    Article content:
    ${content}
  `;

  return generateWithGroq(prompt);
}

/**
 * Generate tag suggestions based on article content
 * @param {string} content - The article content
 * @returns {Promise<string[]>} - Array of suggested tags
 */
export async function suggestTags(content) {
  const prompt = `
    Based on the following article content, suggest 5-7 relevant tags/topics.
    Return only the tags as a comma-separated list, without any explanation or additional text.
    
    Article content:
    ${content}
  `;

  const response = await generateWithGroq(prompt);
  // Parse the comma-separated list into an array
  return response.split(",").map((tag) => tag.trim());
}

/**
 * Generate title suggestions based on article content
 * @param {string} content - The article content
 * @returns {Promise<string[]>} - Array of suggested titles
 */
export async function suggestTitles(content) {
  const prompt = `
    Based on the following article content, suggest 3 engaging, click-worthy title options.
    Return them as a numbered list (1., 2., 3.), with each title on a new line.
    
    Article content:
    ${content}
  `;

  const response = await generateWithGroq(prompt);
  // Parse the numbered list into an array
  return response
    .split("\n")
    .filter((line) => line.trim().match(/^\d+\.\s/))
    .map((line) => line.replace(/^\d+\.\s/, "").trim());
}

/**
 * React hook for generating AI content with loading state
 * @param {Function} generatorFunction - The generator function to call
 * @param {any[]} deps - Dependencies that should trigger regeneration
 * @returns {[string|string[], boolean, Error|null, Function]} - [result, loading, error, generate]
 */
export function useGroqGenerator(generatorFunction, deps = []) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generatorFunction(...args);
      setResult(data);
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return [result, loading, error, generate];
}
