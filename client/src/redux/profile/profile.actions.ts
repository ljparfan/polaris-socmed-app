import { createAction } from "@reduxjs/toolkit";
import { FriendRequest } from "../../models/FriendRequest";
import { Friendship } from "../../models/friendship.model";
import { PaginationRequest } from "../../models/pagination-request.model";
import { PaginationResponse } from "../../models/pagination-response.model";
import { Profile } from "../../models/profile.model";
import { ProfileTypes } from "./profile.types";

export const searchProfilesStart = createAction<
  { keyword: string; pagination: PaginationRequest },
  ProfileTypes.SEARCH_PROFILES_START
>(ProfileTypes.SEARCH_PROFILES_START);

export const searchProfilesSuccess = createAction<
  { data: Profile[]; pagination: PaginationResponse },
  ProfileTypes.SEARCH_PROFILES_SUCCESS
>(ProfileTypes.SEARCH_PROFILES_SUCCESS);

export const searchProfilesFailure = createAction<
  string,
  ProfileTypes.SEARCH_PROFILES_FAILURE
>(ProfileTypes.SEARCH_PROFILES_FAILURE);

export const resetSelectedProfile = createAction<
  void,
  ProfileTypes.RESET_SELECTED_PROFILE
>(ProfileTypes.RESET_SELECTED_PROFILE);

export const fetchProfileStart = createAction<
  string,
  ProfileTypes.FETCH_PROFILE_START
>(ProfileTypes.FETCH_PROFILE_START);

export const fetchProfileSuccess = createAction<
  Profile,
  ProfileTypes.FETCH_PROFILE_SUCCESS
>(ProfileTypes.FETCH_PROFILE_SUCCESS);

export const fetchProfileFailure = createAction<
  string,
  ProfileTypes.FETCH_PROFILE_FAILURE
>(ProfileTypes.FETCH_PROFILE_FAILURE);

export const sendFriendRequestStart = createAction<
  { profileId: number; friendshipId?: number },
  ProfileTypes.SEND_FRIEND_REQUEST_START
>(ProfileTypes.SEND_FRIEND_REQUEST_START);

export const sendFriendRequestSuccess = createAction<
  Friendship,
  ProfileTypes.SEND_FRIEND_REQUEST_SUCCESS
>(ProfileTypes.SEND_FRIEND_REQUEST_SUCCESS);

export const sendFriendRequestFailure = createAction<
  string,
  ProfileTypes.SEND_FRIEND_REQUEST_FAILURE
>(ProfileTypes.SEND_FRIEND_REQUEST_FAILURE);

export const acceptFriendRequestStart = createAction<
  { profileId: number; friendshipId?: number },
  ProfileTypes.ACCEPT_FRIEND_REQUEST_START
>(ProfileTypes.ACCEPT_FRIEND_REQUEST_START);

export const acceptFriendRequestSuccess = createAction<
  Friendship,
  ProfileTypes.ACCEPT_FRIEND_REQUEST_SUCCESS
>(ProfileTypes.ACCEPT_FRIEND_REQUEST_SUCCESS);

export const acceptFriendRequestFailure = createAction<
  string,
  ProfileTypes.ACCEPT_FRIEND_REQUEST_FAILURE
>(ProfileTypes.ACCEPT_FRIEND_REQUEST_FAILURE);

export const rejectFriendRequestStart = createAction<
  { profileId: number; friendshipId?: number },
  ProfileTypes.REJECT_FRIEND_REQUEST_START
>(ProfileTypes.REJECT_FRIEND_REQUEST_START);

export const rejectFriendRequestSuccess = createAction<
  Friendship,
  ProfileTypes.REJECT_FRIEND_REQUEST_SUCCESS
>(ProfileTypes.REJECT_FRIEND_REQUEST_SUCCESS);

export const rejectFriendRequestFailure = createAction<
  string,
  ProfileTypes.REJECT_FRIEND_REQUEST_FAILURE
>(ProfileTypes.REJECT_FRIEND_REQUEST_FAILURE);

export const cancelFriendRequestStart = createAction<
  { profileId: number; friendshipId?: number },
  ProfileTypes.CANCEL_FRIEND_REQUEST_START
>(ProfileTypes.CANCEL_FRIEND_REQUEST_START);

export const cancelFriendRequestSuccess = createAction<
  Friendship,
  ProfileTypes.CANCEL_FRIEND_REQUEST_SUCCESS
>(ProfileTypes.CANCEL_FRIEND_REQUEST_SUCCESS);

export const cancelFriendRequestFailure = createAction<
  string,
  ProfileTypes.CANCEL_FRIEND_REQUEST_FAILURE
>(ProfileTypes.CANCEL_FRIEND_REQUEST_FAILURE);

export const removeFriendStart = createAction<
  { profileId: number; friendshipId?: number },
  ProfileTypes.REMOVE_FRIEND_START
>(ProfileTypes.REMOVE_FRIEND_START);

export const removeFriendSuccess = createAction<
  Friendship,
  ProfileTypes.REMOVE_FRIEND_SUCCESS
>(ProfileTypes.REMOVE_FRIEND_SUCCESS);

export const removeFriendFailure = createAction<
  string,
  ProfileTypes.REMOVE_FRIEND_FAILURE
>(ProfileTypes.REMOVE_FRIEND_FAILURE);

export const fetchProfileFriendsStart = createAction<
  { username: string; pagination: PaginationRequest },
  ProfileTypes.FETCH_PROFILE_FRIENDS_START
>(ProfileTypes.FETCH_PROFILE_FRIENDS_START);

export const fetchProfileFriendsSuccess = createAction<
  { data: Profile[]; pagination: PaginationResponse },
  ProfileTypes.FETCH_PROFILE_FRIENDS_SUCCESS
>(ProfileTypes.FETCH_PROFILE_FRIENDS_SUCCESS);

export const fetchProfileFriendsFailure = createAction<
  string,
  ProfileTypes.FETCH_PROFILE_FRIENDS_FAILURE
>(ProfileTypes.FETCH_PROFILE_FRIENDS_FAILURE);

export const fetchFriendRequestsSuccess = createAction<
  {
    data: FriendRequest[];
    pagination: PaginationResponse;
  },
  ProfileTypes.FETCH_RECEIVED_FRIEND_REQUESTS_SUCCESS
>(ProfileTypes.FETCH_RECEIVED_FRIEND_REQUESTS_SUCCESS);

export const fetchFriendRequestsStart = createAction<
  PaginationRequest,
  ProfileTypes.FETCH_RECEIVED_FRIEND_REQUESTS_START
>(ProfileTypes.FETCH_RECEIVED_FRIEND_REQUESTS_START);

export const fetchFriendRequestsFailure = createAction<
  string,
  ProfileTypes.FETCH_RECEIVED_FRIEND_REQUESTS_FAILURE
>(ProfileTypes.FETCH_RECEIVED_FRIEND_REQUESTS_FAILURE);

export const resetFriendRequests = createAction<
  void,
  ProfileTypes.RESET_FRIEND_REQUESTS_DATA
>(ProfileTypes.RESET_FRIEND_REQUESTS_DATA);
