import { createReducer, isAnyOf } from "@reduxjs/toolkit";
import {
  acceptFriendRequestStart,
  acceptFriendRequestSuccess,
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
  rejectFriendRequestStart,
  rejectFriendRequestSuccess,
  removeFriendStart,
  removeFriendSuccess,
  resetFriendRequests,
  resetSelectedProfile,
  searchProfilesFailure,
  searchProfilesStart,
  searchProfilesSuccess,
  sendFriendRequestStart,
  sendFriendRequestSuccess,
} from "./profile.actions";
import { initialProfileState } from "./profile.state";
import { ProfileTypes } from "./profile.types";

const profileReducer = createReducer(initialProfileState, (builder) =>
  builder
    .addCase(searchProfilesStart, (state, _action) => {
      state.searchProfilesLoading = true;
    })
    .addCase(searchProfilesSuccess, (state, action) => {
      state.searchProfilesLoading = false;
      state.searchProfilesResult = {
        pagination: action.payload.pagination,
        data:
          action.payload.pagination.page === 1
            ? action.payload.data
            : [...state.searchProfilesResult.data, ...action.payload.data],
      };
    })
    .addCase(searchProfilesFailure, (state, action) => {
      state.searchProfilesError = action.payload;
    })
    .addCase(fetchProfileStart, (state, _action) => {
      state.fetchProfileLoading = true;
    })
    .addCase(fetchProfileSuccess, (state, action) => {
      state.fetchProfileLoading = false;
      state.selectedProfile = action.payload;
    })
    .addCase(fetchProfileFailure, (state, action) => {
      state.fetchProfileError = action.payload;
    })
    .addCase(resetSelectedProfile, (state, _action) => {
      state.selectedProfile = null;
    })
    .addCase(fetchProfileFriendsStart, (state, _action) => {
      state.fetchFriendsLoading = true;
    })
    .addCase(fetchProfileFriendsFailure, (state, action) => {
      state.fetchFriendsLoading = false;
      state.fetchFriendsError = action.payload;
    })
    .addCase(fetchProfileFriendsSuccess, (state, action) => {
      state.fetchFriendsLoading = false;
      state.friends = {
        pagination: action.payload.pagination,
        data:
          action.payload.pagination.page === 1
            ? action.payload.data
            : [...state.friends.data, ...action.payload.data],
      };
    })
    .addCase(fetchFriendRequestsStart, (state, _action) => {
      state.friendRequestsLoading = true;
    })
    .addCase(fetchFriendRequestsFailure, (state, action) => {
      state.friendRequestsLoading = false;
      state.friendRequestsError = action.payload;
    })
    .addCase(resetFriendRequests, (state, _action) => {
      state.friendRequests = {
        data: [],
        pagination: {
          page: 1,
          totalCount: 0,
        },
      };
    })
    .addCase(fetchFriendRequestsSuccess, (state, action) => {
      state.friendRequestsLoading = false;
      state.friendRequests = {
        pagination: action.payload.pagination,
        data:
          action.payload.pagination.page === 1
            ? action.payload.data
            : [...state.friendRequests.data, ...action.payload.data],
      };
    })
    .addMatcher(
      isAnyOf(
        sendFriendRequestSuccess,
        cancelFriendRequestSuccess,
        acceptFriendRequestSuccess,
        rejectFriendRequestSuccess,
        removeFriendSuccess
      ),
      (state, action) => {
        state.friendshipActionLoading = {
          loading: false,
        };
        state.friends = {
          ...state.friends,
          data: state.friends.data.map((profile) => {
            if (
              action.type === ProfileTypes.CANCEL_FRIEND_REQUEST_SUCCESS ||
              action.type === ProfileTypes.REMOVE_FRIEND_SUCCESS
            ) {
              return {
                ...profile,
                friendshipWithCurrentUser: undefined,
              };
            }
            if (
              profile.id === action.payload.requesteeId ||
              profile.id === action.payload.requestorId
            ) {
              return { ...profile, friendshipWithCurrentUser: action.payload };
            }

            return profile;
          }),
        };

        if (
          state.selectedProfile?.id === action.payload.requesteeId ||
          state.selectedProfile?.id === action.payload.requestorId
        ) {
          if (
            action.type === ProfileTypes.CANCEL_FRIEND_REQUEST_SUCCESS ||
            action.type === ProfileTypes.REMOVE_FRIEND_SUCCESS
          ) {
            state.selectedProfile = {
              ...state.selectedProfile,
              friendshipWithCurrentUser: undefined,
            };
          } else {
            state.selectedProfile = {
              ...state.selectedProfile,
              friendshipWithCurrentUser: action.payload,
            };
          }
        }
      }
    )
    .addMatcher(
      isAnyOf(
        sendFriendRequestStart,
        acceptFriendRequestStart,
        rejectFriendRequestStart,
        cancelFriendRequestStart,
        removeFriendStart
      ),
      (state, action) => ({
        ...state,
        friendshipActionLoading: {
          loading: true,
          profileId: action.payload.profileId,
          friendshipId: action.payload.friendshipId,
        },
      })
    )
);

export default profileReducer;
