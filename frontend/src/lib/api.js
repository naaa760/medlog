/**
 * API utility functions to connect with the backend
 */

// Base API URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/**
 * Makes an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/posts')
 * @param {Object} options - Fetch options
 * @param {string} token - Auth token (optional)
 * @returns {Promise} - API response
 */
export async function apiRequest(endpoint, options = {}, token = null) {
  const url = `${API_BASE_URL}/api${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization header if token is provided
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

/**
 * Update your Next.js API routes to use this utility
 * Example usage in existing API route:
 *
 * // In /api/posts/route.js
 * import { apiRequest } from '@/lib/api';
 *
 * export async function GET(request) {
 *   const { searchParams } = new URL(request.url);
 *   const params = Object.fromEntries(searchParams.entries());
 *
 *   try {
 *     const data = await apiRequest('/posts', {
 *       method: 'GET',
 *       params
 *     });
 *     return NextResponse.json(data);
 *   } catch (error) {
 *     return NextResponse.json({ error: error.message }, { status: 500 });
 *   }
 * }
 */
