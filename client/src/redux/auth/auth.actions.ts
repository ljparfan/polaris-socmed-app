import { createAction } from "@reduxjs/toolkit";
import { AuthUser } from "../../models/auth-user.model";
import { RegisterForm } from "../../models/register-form";
import { AuthTypes } from "./auth.types";

export const signInStart = createAction<
  { usernameOrEmail: string; password: string },
  AuthTypes.SIGN_IN_START
>(AuthTypes.SIGN_IN_START);

export const signInSuccess = createAction<string, AuthTypes.SIGN_IN_SUCCESS>(
  AuthTypes.SIGN_IN_SUCCESS
);

export const signInFailure = createAction<string, AuthTypes.SIGN_IN_FAILURE>(
  AuthTypes.SIGN_IN_FAILURE
);

export const signUpStart = createAction<RegisterForm, AuthTypes.SIGN_UP_START>(
  AuthTypes.SIGN_UP_START
);

export const signUpSuccess = createAction<AuthUser, AuthTypes.SIGN_UP_SUCCESS>(
  AuthTypes.SIGN_UP_SUCCESS
);

export const signUpFailure = createAction<string[], AuthTypes.SIGN_UP_FAILURE>(
  AuthTypes.SIGN_UP_FAILURE
);

export const resetSignUpErrors = createAction<
  void,
  AuthTypes.RESET_SIGN_UP_ERRORS
>(AuthTypes.RESET_SIGN_UP_ERRORS);

export const signOutStart = createAction<void, AuthTypes.SIGN_OUT_START>(
  AuthTypes.SIGN_OUT_START
);

export const signOutSuccess = createAction<void, AuthTypes.SIGN_OUT_SUCCESS>(
  AuthTypes.SIGN_OUT_SUCCESS
);

export const signOutFailure = createAction<string, AuthTypes.SIGN_OUT_FAILURE>(
  AuthTypes.SIGN_OUT_FAILURE
);

export const getAccessTokenStart = createAction<
  void,
  AuthTypes.GET_ACCESS_TOKEN_START
>(AuthTypes.GET_ACCESS_TOKEN_START);

export const getAccessTokenSuccess = createAction<
  string,
  AuthTypes.GET_ACCESS_TOKEN_SUCCESS
>(AuthTypes.GET_ACCESS_TOKEN_SUCCESS);

export const getAccessTokenFailure = createAction<
  string,
  AuthTypes.GET_ACCESS_TOKEN_FAILURE
>(AuthTypes.GET_ACCESS_TOKEN_FAILURE);

export const getCurrentUserStart = createAction<
  void,
  AuthTypes.GET_CURRENT_USER_START
>(AuthTypes.GET_CURRENT_USER_START);

export const getCurrentUserSuccess = createAction<
  AuthUser,
  AuthTypes.GET_CURRENT_USER_SUCCESS
>(AuthTypes.GET_CURRENT_USER_SUCCESS);

export const getCurrentUserFailure = createAction<
  string,
  AuthTypes.GET_CURRENT_USER_FAILURE
>(AuthTypes.GET_CURRENT_USER_FAILURE);
