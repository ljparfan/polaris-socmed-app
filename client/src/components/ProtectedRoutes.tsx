import { Navigate, Outlet } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectIsAuthPending,
} from "../redux/auth/auth.selectors";
import { useAppSelector } from "../redux/hooks";
import Shell from "./Shell";

const ProtectedRoutes = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectIsAuthPending);

  if (authLoading) {
    return null;
  }
  return isAuthenticated ? (
    <Shell>
      <Outlet />
    </Shell>
  ) : (
    <Navigate to="/auth" />
  );
};

export default ProtectedRoutes;
