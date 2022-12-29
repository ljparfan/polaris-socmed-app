import { createSelector } from "reselect";
import { FriendshipStatus } from "../../models/friendship-status.enum";
import { Profile } from "../../models/profile.model";
import { selectCurrentUser } from "../auth/auth.selectors";
import { RootState } from "../store";

const selectProfiles = (state: RootState) => state.profile;

export const selectSearchProfilesData = createSelector(
  [selectProfiles],
  ({ searchProfilesResult }) => searchProfilesResult.data
);

export const selectSearchProfilesPagination = createSelector(
  [selectProfiles],
  ({ searchProfilesResult }) => searchProfilesResult.pagination
);

export const selectSearchProfilesHasMoreToFetch = createSelector(
  [selectProfiles],
  ({ searchProfilesResult }) =>
    searchProfilesResult.data.length <
    searchProfilesResult.pagination.totalCount
);

export const selectSearchProfilesLoading = createSelector(
  [selectProfiles],
  ({ searchProfilesLoading }) => searchProfilesLoading
);

export const selectShowLoadMoreProfilesToSearch = createSelector(
  [selectProfiles],
  ({ searchProfilesResult }) => {
    const currentCount = searchProfilesResult.data.length;
    const totalCount = searchProfilesResult.pagination.totalCount;

    return currentCount < totalCount;
  }
);

export const selectShowLoadMoreFriendRequests = createSelector(
  [selectProfiles],
  ({ friendRequests }) => {
    const currentCount = friendRequests.data.length;
    const totalCount = friendRequests.pagination.totalCount;

    return currentCount < totalCount;
  }
);

export const selectFriendRequestsTotalCount = createSelector(
  [selectProfiles],
  ({ friendRequests }) => friendRequests.pagination.totalCount
);

export const selectShowNoResults = createSelector(
  [selectProfiles],
  ({ searchProfilesResult }) => {
    const currentCount = searchProfilesResult.data.length;

    return currentCount === 0;
  }
);

export const selectSelectedProfile = createSelector(
  [selectProfiles],
  ({ selectedProfile }) => selectedProfile
);

export const selectIsSelectedProfileFetching = createSelector(
  [selectProfiles],
  ({ fetchProfileLoading }) => fetchProfileLoading
);

export const selectFriendRequestsData = createSelector(
  [selectProfiles],
  ({ friendRequests }) => friendRequests.data
);

export const selectFriendRequestsPagination = createSelector(
  [selectProfiles],
  ({ friendRequests }) => friendRequests.pagination
);

export const selectFriendRequestsLoading = createSelector(
  [selectProfiles],
  ({ friendRequestsLoading }) => friendRequestsLoading
);

export const selectIsFriendshipActionLoading = (profileId: number) =>
  createSelector(
    [selectProfiles],
    ({ friendshipActionLoading }) =>
      friendshipActionLoading &&
      friendshipActionLoading.loading &&
      friendshipActionLoading.profileId === profileId
  );
export const selectFriendsData = createSelector(
  [selectProfiles],
  ({ friends }) => friends.data
);

export const selectFriendsLoading = createSelector(
  [selectProfiles],
  ({ fetchFriendsLoading }) => fetchFriendsLoading
);

export const selectHasMoreFriendsToFetch = createSelector(
  [selectProfiles],
  ({ friends }) => {
    const currentCount = friends.data.length;
    const totalCount = friends.pagination.totalCount;

    return currentCount < totalCount;
  }
);

export const selectFriendsPagination = createSelector(
  [selectProfiles],
  ({ friends }) => friends.pagination
);

export const selectFriendshipWithCurrentUser = (profile?: Profile) =>
  createSelector([selectCurrentUser], (currentUser) => {
    if (!currentUser || !profile) {
      return FriendshipStatus.NONE;
    }

    const friendship = profile.friendshipWithCurrentUser;

    if (!friendship || !friendship.status) {
      return FriendshipStatus.NONE;
    }

    if (friendship.status === "ACCEPTED") {
      return FriendshipStatus.ACCEPTED;
    }

    if (friendship.status === "REJECTED") {
      return FriendshipStatus.REJECTED;
    }

    if (friendship.status === "PENDING") {
      if (friendship.requestorId === currentUser.id) {
        return FriendshipStatus.PENDING_SENT;
      }

      if (friendship.requesteeId === currentUser.id) {
        return FriendshipStatus.PENDING_RECEIVED;
      }
    }

    return friendship.status;
  });

export const selectIsSelectedProfileCurrentUser = createSelector(
  [selectProfiles],
  ({ selectedProfile }) => selectedProfile?.isCurrentUser
);
