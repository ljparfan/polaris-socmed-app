import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "../redux/auth/auth.selectors";
import { useAppSelector } from "../redux/hooks";

const AnonymousRoutes = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default AnonymousRoutes;
