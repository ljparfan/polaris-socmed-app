import { all, call, takeLatest, put, delay } from "redux-saga/effects";
import { AuthUser } from "../../models/auth-user.model";
import { LoginResponse } from "../../models/login-response.model";
import * as authService from "../../services/auth.service";
import { HttpError } from "../../services/http.service";
import { hideAlert, showAlert } from "../general/general.actions";
import { fetchFriendRequestsStart } from "../profile/profile.actions";
import {
  getAccessTokenFailure,
  getAccessTokenStart,
  getAccessTokenSuccess,
  getCurrentUserFailure,
  getCurrentUserSuccess,
  signInFailure,
  signInStart,
  signInSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "./auth.actions";

function* signIn({
  payload,
}: ReturnType<typeof signInStart>): Generator<any, any, any> {
  try {
    const { accessToken }: LoginResponse = yield call(
      authService.login,
      payload.usernameOrEmail,
      payload.password
    );

    yield put(signInSuccess(accessToken));
  } catch (error) {
    console.log({ error });

    yield put(signInFailure((error as HttpError).message));
    yield put(
      showAlert({
        type: "error",
        message: (error as HttpError).response
          ? (error as HttpError).response!.data.error.message
          : "Invalid credentials",
      })
    );
    yield delay(5_000);
    yield put(hideAlert());
  }
}

function* signUp({
  payload,
}: ReturnType<typeof signUpStart>): Generator<any, any, any> {
  try {
    const response: AuthUser = yield call(authService.signUp, payload);
    yield put(signUpSuccess(response));
    yield put(
      signInStart({
        usernameOrEmail: payload.username,
        password: payload.password,
      })
    );
  } catch (error) {
    const validationErrors =
      ((error as HttpError).response?.data?.validationErrors as {
        constraints: any;
      }[]) || [];

    const stringListOfErrors: string[] = [];

    validationErrors.forEach(({ constraints }) => {
      Object.keys(constraints).map((key) =>
        stringListOfErrors.push(constraints[key])
      );
    });

    yield put(signUpFailure(stringListOfErrors));
  }
}

function* fetchAccessToken(): Generator<any, any, any> {
  try {
    const { accessToken } = yield authService.fetchAccessToken();
    yield put(getAccessTokenSuccess(accessToken));
  } catch (error) {
    yield put(getAccessTokenFailure((error as HttpError).message));
  }
}

function* getCurrentUser({
  payload,
}: ReturnType<typeof getAccessTokenSuccess>): Generator<any, any, any> {
  try {
    const authUser = yield authService.getCurrentUser(payload);
    yield put(getCurrentUserSuccess(authUser));
  } catch (error) {
    yield put(getCurrentUserFailure((error as HttpError).message));
  }
}

function* signOut() {
  try {
    yield authService.logout();
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure((error as HttpError).message));
  }
}

function* getNotifications() {
  yield put(
    fetchFriendRequestsStart({
      pageNumber: 1,
      pageSize: 5,
    })
  );
}

function* onGetAccessTokenStart() {
  yield takeLatest(getAccessTokenStart.type, fetchAccessToken);
}

function* onGetAccessTokenSuccess() {
  yield takeLatest(getAccessTokenSuccess.type, getCurrentUser);
}

function* onSignInSuccess() {
  yield takeLatest(signInSuccess.type, getCurrentUser);
}

function* onSignInStart() {
  yield takeLatest(signInStart.type, signIn);
}

function* onSignUpStart() {
  yield takeLatest(signUpStart.type, signUp);
}

function* onSignOutStart() {
  yield takeLatest(signOutStart.type, signOut);
}

function* onGetCurrentUserSuccess() {
  yield takeLatest(getCurrentUserSuccess.type, getNotifications);
}

export function* authSagas() {
  yield all([
    call(onSignInStart),
    call(onSignOutStart),
    call(onGetAccessTokenStart),
    call(onGetAccessTokenSuccess),
    call(onSignInSuccess),
    call(onGetCurrentUserSuccess),
    call(onSignUpStart),
  ]);
}
