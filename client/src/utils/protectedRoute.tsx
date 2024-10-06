import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { verifyToken } from "../services/authService";
import Loader from "./loader";

const ProtectedRoute = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        await verifyToken();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/account" />;
  }

  return children;
};

export default ProtectedRoute;
