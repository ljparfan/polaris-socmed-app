import { createReducer, isAnyOf } from "@reduxjs/toolkit";
import { initialAuthState } from "./auth.state";
import {
  getAccessTokenFailure,
  getAccessTokenStart,
  getAccessTokenSuccess,
  getCurrentUserFailure,
  getCurrentUserStart,
  getCurrentUserSuccess,
  resetSignUpErrors,
  signInFailure,
  signInStart,
  signInSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
  signUpFailure,
  signUpStart,
} from "./auth.actions";

const authReducer = createReducer(initialAuthState, (builder) =>
  builder
    .addCase(signOutSuccess, (state, _action) => {
      state.loading = false;
      state.accessToken = null;
      state.currentUser = undefined;
      state.error = null;
    })
    .addCase(getCurrentUserSuccess, (state, action) => {
      state.currentUser = action.payload;
    })
    .addCase(signUpFailure, (state, action) => {
      state.signUpErrors = action.payload;
      state.loading = false;
    })
    .addCase(resetSignUpErrors, (state, _action) => {
      state.signUpErrors = [];
    })
    .addMatcher(
      isAnyOf(signInSuccess, getAccessTokenSuccess),
      (state, action) => {
        state.accessToken = action.payload;
      }
    )
    .addMatcher(
      isAnyOf(
        signInStart,
        signOutStart,
        signUpStart,
        getCurrentUserStart,
        getAccessTokenStart
      ),
      (state, _action) => {
        state.loading = true;
      }
    )
    .addMatcher(
      isAnyOf(
        signInFailure,
        signOutFailure,
        getCurrentUserFailure,
        getAccessTokenFailure
      ),
      (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }
    )
    .addMatcher(
      isAnyOf(
        signInSuccess,
        signOutSuccess,
        getAccessTokenSuccess,
        getCurrentUserSuccess
      ),
      (state, _action) => {
        state.loading = false;
      }
    )
);

export default authReducer;
