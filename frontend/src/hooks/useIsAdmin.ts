import { useState, useEffect } from "react";
import api from "@/api/api";
import { ACCESS_TOKEN } from "@/lib/constants";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/users/me/");
        setIsAdmin(response.data.is_staff || false);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, isLoading };
}
