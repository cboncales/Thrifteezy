import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useAuth = () => {
  const { user, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );
  return { user, isLoading, error };
};
