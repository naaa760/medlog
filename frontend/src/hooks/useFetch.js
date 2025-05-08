import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { apiRequest } from "@/lib/api";

export function useFetch(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken, isSignedIn } = useUser();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Get token if user is signed in
      let token = null;
      if (isSignedIn) {
        token = await getToken();
      }

      const result = await apiRequest(endpoint, options, token);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [endpoint, options, getToken, isSignedIn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}
