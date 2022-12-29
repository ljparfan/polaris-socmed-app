import { all, call, takeLatest, put, select } from "redux-saga/effects";
import * as profileService from "../../services/profile.service";
import { HttpError } from "../../services/http.service";

import { PaginationResponse } from "../../models/pagination-response.model";

import {
  acceptFriendRequestFailure,
  acceptFriendRequestStart,
  acceptFriendRequestSuccess,
  cancelFriendRequestFailure,
  cancelFriendRequestStart,
  cancelFriendRequestSuccess,
  fetchFriendRequestsFailure,
  fetchFriendRequestsStart,
  fetchFriendRequestsSuccess,
  fetchProfileFailure,
  fetchProfileFriendsFailure,
  fetchProfileFriendsStart,
  fetchProfileFriendsSuccess,
  fetchProfileStart,
  fetchProfileSuccess,
  rejectFriendRequestFailure,
  rejectFriendRequestStart,
  rejectFriendRequestSuccess,
  removeFriendStart,
  searchProfilesFailure,
  searchProfilesStart,
  searchProfilesSuccess,
  sendFriendRequestFailure,
  sendFriendRequestStart,
  sendFriendRequestSuccess,
} from "./profile.actions";
import { Profile } from "../../models/profile.model";
import { Friendship } from "../../models/friendship.model";
import { showAlert } from "../general/general.actions";
import { FriendRequest } from "../../models/FriendRequest";
import { selectFriendRequestsPagination } from "./profile.selectors";

function* searchProfiles({
  payload: { keyword, pagination },
}: ReturnType<typeof searchProfilesStart>) {
  try {
    const response: { data: Profile[]; pagination: PaginationResponse } =
      yield profileService.searchProfiles(keyword, pagination);
    yield put(searchProfilesSuccess(response));
  } catch (error) {
    yield put(searchProfilesFailure((error as HttpError).message));
  }
}

function* fetchProfileFriends({
  payload: { username, pagination },
}: ReturnType<typeof fetchProfileFriendsStart>) {
  try {
    const response: { data: Profile[]; pagination: PaginationResponse } =
      yield profileService.fetchProfileFriends(username, pagination);
    yield put(fetchProfileFriendsSuccess(response));
  } catch (error) {
    yield put(fetchProfileFriendsFailure((error as HttpError).message));
  }
}

function* fetchProfile({
  payload: username,
}: ReturnType<typeof fetchProfileStart>) {
  try {
    const response: Profile = yield profileService.fetchProfile(username);
    yield put(fetchProfileSuccess(response));
  } catch (error) {
    yield put(fetchProfileFailure((error as HttpError).message));
  }
}

function* addFriend({
  payload: { profileId },
}: ReturnType<typeof sendFriendRequestStart>) {
  try {
    const response: Friendship = yield profileService.addFriend(profileId);
    yield put(sendFriendRequestSuccess(response));
    yield put(
      showAlert({
        type: "success",
        message: "Successfully sent friend request.",
      })
    );
  } catch (error) {
    yield put(sendFriendRequestFailure((error as HttpError).message));
    yield put(
      showAlert({
        type: "error",
        message: (error as HttpError)?.response?.data,
      })
    );
  }
}

function* cancelFriendRequest({
  payload: { friendshipId },
  type,
}:
  | ReturnType<typeof cancelFriendRequestStart>
  | ReturnType<typeof removeFriendStart>) {
  try {
    const response: Friendship = yield profileService.cancelFriendRequest(
      friendshipId!
    );
    yield put(cancelFriendRequestSuccess(response));
    yield put(
      showAlert({
        type: "success",
        message:
          type === cancelFriendRequestStart.type
            ? "Successfully cancelled friend request."
            : "Successfully removed friend.",
      })
    );
  } catch (error) {
    yield put(cancelFriendRequestFailure((error as HttpError).message));
    yield put(
      showAlert({
        type: "error",
        message: (error as HttpError)?.response?.data,
      })
    );
  }
}

function* acceptFriendRequest({
  payload: { friendshipId },
}: ReturnType<typeof acceptFriendRequestStart>) {
  try {
    const response: Friendship = yield profileService.acceptFriendRequest(
      friendshipId!
    );
    yield put(acceptFriendRequestSuccess(response));
    yield put(
      showAlert({
        type: "success",
        message: "You are now friends.",
      })
    );
    const pagination: PaginationResponse = yield select(
      selectFriendRequestsPagination
    );
    yield put(
      fetchFriendRequestsStart({
        pageNumber: pagination.page,
        pageSize: 5,
      })
    );
  } catch (error) {
    yield put(acceptFriendRequestFailure((error as HttpError).message));
    yield put(
      showAlert({
        type: "error",
        message: (error as HttpError)?.response?.data,
      })
    );
  }
}

function* rejectFriendRequest({
  payload: { friendshipId },
}: ReturnType<typeof rejectFriendRequestStart>) {
  try {
    const response: Friendship = yield profileService.rejectedFriendRequest(
      friendshipId!
    );
    yield put(rejectFriendRequestSuccess(response));
    yield put(
      showAlert({
        type: "success",
        message: "Successfully rejected request.",
      })
    );
    const pagination: PaginationResponse = yield select(
      selectFriendRequestsPagination
    );
    yield put(
      fetchFriendRequestsStart({
        pageNumber: pagination.page,
        pageSize: 5,
      })
    );
  } catch (error) {
    yield put(rejectFriendRequestFailure((error as HttpError).message));
    yield put(
      showAlert({
        type: "error",
        message: (error as HttpError)?.response?.data,
      })
    );
  }
}

function* fetchPendingReceivedFriendRequests({
  payload: pagination,
}: ReturnType<typeof fetchFriendRequestsStart>) {
  try {
    const response: {
      data: FriendRequest[];
      pagination: PaginationResponse;
    } = yield profileService.fetchReceivedFriendRequests(pagination);
    yield put(fetchFriendRequestsSuccess(response));
  } catch (error) {
    yield put(fetchFriendRequestsFailure((error as HttpError).message));
  }
}

function* onFetchProfileStart() {
  yield takeLatest(fetchProfileStart.type, fetchProfile);
}

function* onSearchProfilesStart() {
  yield takeLatest(searchProfilesStart.type, searchProfiles);
}

function* onFetchProfileFriendsStart() {
  yield takeLatest(fetchProfileFriendsStart.type, fetchProfileFriends);
}

function* onAddFriendStart() {
  yield takeLatest(sendFriendRequestStart.type, addFriend);
}

function* onCancelFriendRequestStart() {
  yield takeLatest(cancelFriendRequestStart.type, cancelFriendRequest);
}

function* onRemoveFriendStart() {
  yield takeLatest(removeFriendStart.type, cancelFriendRequest);
}

function* onAcceptFriendRequestStart() {
  yield takeLatest(acceptFriendRequestStart.type, acceptFriendRequest);
}

function* onRejectFriendRequestStart() {
  yield takeLatest(rejectFriendRequestStart.type, rejectFriendRequest);
}

function* onFetchPendingReceivedFriendRequestsStart() {
  yield takeLatest(
    fetchFriendRequestsStart.type,
    fetchPendingReceivedFriendRequests
  );
}

export function* profileSagas() {
  yield all([
    call(onSearchProfilesStart),
    call(onFetchProfileStart),
    call(onFetchProfileFriendsStart),
    call(onAddFriendStart),
    call(onAcceptFriendRequestStart),
    call(onRejectFriendRequestStart),
    call(onCancelFriendRequestStart),
    call(onRemoveFriendStart),
    call(onFetchPendingReceivedFriendRequestsStart),
  ]);
}
