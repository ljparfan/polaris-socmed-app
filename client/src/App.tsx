import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { getAccessTokenStart } from "./redux/auth/auth.actions";
import {
  selectAccessToken,
  selectCurrentUser,
  selectIsAuthPending,
} from "./redux/auth/auth.selectors";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import http from "./services/http.service";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AnonymousRoutes from "./components/AnonymousRoutes";
import FullPageSpinner from "./components/FullPageSpinner";
import PostPage from "./pages/PostPage";
import ConfirmationDialog from "./components/ConfirmationDialog";
import ProfilePage from "./pages/ProfilePage";
import { selectDarkThemeEnabled } from "./redux/general/general.selectors";
import { setDarkThemeEnabled } from "./redux/general/general.actions";
import ProfilePostsPage from "./pages/ProfilePostsPage";
import "react-toastify/dist/ReactToastify.min.css";
import ProfileFriendsPage from "./pages/ProfileFriendsPage";
import AuthLoginPage from "./pages/AuthLoginPage";
import AuthRegisterPage from "./pages/AuthRegisterPage";
import FullSizePhotoViewer from "./components/FullSizePhotoViewer";

type Props = {};

const App = (props: Props) => {
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthPending = useAppSelector(selectIsAuthPending);
  const currentUser = useAppSelector(selectCurrentUser);
  const darkThemeEnabled = useAppSelector(selectDarkThemeEnabled);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAccessTokenStart());
    const darkThemeOnStorage = localStorage.getItem("darkThemeEnabled");

    if (darkThemeOnStorage) {
      dispatch(setDarkThemeEnabled(darkThemeOnStorage === "true"));
    } else {
      const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;

      if (prefersDark) {
        dispatch(setDarkThemeEnabled(true));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("darkThemeEnabled", "" + darkThemeEnabled);
  }, [darkThemeEnabled]);

  useEffect(() => {
    const jwtInterceptor = http.interceptors.request.use((request) => {
      if (!accessToken) {
        return request;
      }

      request.headers!["Authorization"] = `Bearer ${accessToken}`;

      return request;
    });
    const errorHandlerInterceptor = http.interceptors.response.use(
      (response) => {
        return response;
      }
    );

    return () => {
      http.interceptors.request.eject(jwtInterceptor);
      http.interceptors.request.eject(errorHandlerInterceptor);
    };
  }, [accessToken]);

  if (isAuthPending) {
    return <FullPageSpinner />;
  }

  return (
    <div className={`h-screen ${darkThemeEnabled ? "dark" : ""}`}>
      <ConfirmationDialog />
      <FullSizePhotoViewer />
      <ToastContainer theme={darkThemeEnabled ? "light" : "dark"} />
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/me"
            element={<Navigate to={`/${currentUser?.username}`} />}
          />
          <Route path="/:username" element={<ProfilePage />}>
            <Route path="" element={<ProfilePostsPage />} />
            <Route path="friends" element={<ProfileFriendsPage />} />
          </Route>
          <Route path="/posts/:id" element={<PostPage />} />
        </Route>
        <Route element={<AnonymousRoutes />}>
          <Route path="/auth" element={<AuthPage />}>
            <Route path="" element={<AuthLoginPage />} />
            <Route path="register" element={<AuthRegisterPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
