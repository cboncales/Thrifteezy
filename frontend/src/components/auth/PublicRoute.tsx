import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return null;
  }

  if (user) {
    // If user is already logged in, redirect to home page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
