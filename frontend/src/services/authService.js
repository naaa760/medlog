import api from "./api";
import { useAuth } from "@clerk/nextjs";

// Register user with backend after Clerk signup
export const registerWithBackend = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Error registering with backend:", error);
    throw error;
  }
};

// Sync Clerk user with backend
export const syncUserWithBackend = async (clerkUser) => {
  if (!clerkUser) return null;

  try {
    // Create backend user if doesn't exist
    const userData = {
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      username: clerkUser.username || `user${Date.now()}`,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      password: Math.random().toString(36).slice(-16), // Random password
      clerkId: clerkUser.id,
    };

    const response = await api.post("/users/sync", userData);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Error syncing with backend:", error);
    return null;
  }
};

// Get JWT token for backend API calls
export const getBackendToken = () => {
  return localStorage.getItem("token");
};
