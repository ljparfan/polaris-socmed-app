import { createSelector } from "reselect";
import { DecodedAccessToken } from "../../models/decoded-access-token.model";
import { decodeJWT } from "../../services/auth.service";
import { RootState } from "../store";

const selectAuth = (state: RootState) => state.auth;
// Other code such as selectors can use the imported `RootState` type

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => !!auth.accessToken
);

export const selectAccessToken = createSelector(
  [selectAuth],
  (auth) => auth.accessToken
);

export const selectIsAuthPending = createSelector(
  [selectAuth],
  (auth) => auth.loading
);

export const selectCurrentUser = createSelector(
  [selectAuth],
  (auth) => auth.currentUser
);

export const selectSignUpErrors = createSelector(
  [selectAuth],
  (auth) => auth.signUpErrors
);

export const selectDecodedAccessToken = createSelector([selectAuth], (auth) => {
  if (!auth.accessToken) {
    return null;
  }

  const decoded = decodeJWT(auth.accessToken) as any;

  return new DecodedAccessToken(decoded.userId, decoded.exp);
});
