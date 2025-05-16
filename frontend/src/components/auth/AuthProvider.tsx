import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { getCurrentUser } from "../../store/slices/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // If we have a token but no user, fetch the user data
    if (token && !user && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [token, user, isLoading, dispatch]);

  return <>{children}</>;
};
