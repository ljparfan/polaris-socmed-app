import { LoginResponse } from "../models/login-response.model";
import http from "./http.service";
import jwt_decode from "jwt-decode";
import { AuthUser } from "../models/auth-user.model";
import { RegisterForm } from "../models/register-form";

export const login = (usernameOrEmail: string, password: string) => {
  return http
    .post<LoginResponse>(
      "/auth",
      { usernameOrEmail, password },
      { withCredentials: true }
    )
    .then((response) => response.data);
};

export const getCurrentUser = (accessToken: string) => {
  return http
    .get<AuthUser>("/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
};

export const fetchAccessToken = () => {
  return http
    .post<{ accessToken: string }>("/auth/access-token", undefined, {
      withCredentials: true,
    })
    .then((response) => ({ accessToken: response.data.accessToken }));
};

export const decodeJWT = jwt_decode;

export const logout = () => {
  return http.post("/auth/revoke-refresh-tokens");
};

export const signUp = (registerForm: RegisterForm) => {
  const { photo, username, email, name, password } = registerForm;
  const formData = new FormData();
  if (photo) {
    formData.append("photo", photo);
  }

  formData.append("username", username);
  formData.append("email", email);
  formData.append("name", name);
  formData.append("password", password);

  return http
    .post<AuthUser>("/users", formData)
    .then((response) => response.data);
};
