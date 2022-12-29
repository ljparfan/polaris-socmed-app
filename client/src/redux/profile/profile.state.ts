import { FriendRequest } from "../../models/FriendRequest";
import { PaginationResponse } from "../../models/pagination-response.model";
import { Profile } from "../../models/profile.model";

export interface ProfileState {
  searchProfilesResult: {
    data: Profile[];
    pagination: PaginationResponse;
  };
  friends: {
    data: Profile[];
    pagination: PaginationResponse;
  };
  friendRequests: {
    data: FriendRequest[];
    pagination: PaginationResponse;
  };
  friendRequestsLoading: boolean;
  searchProfilesLoading: boolean;
  searchProfilesError: string;
  fetchProfileLoading: boolean;
  selectedProfile: Profile | null;
  fetchProfileError: string | null;
  fetchFriendsLoading: boolean;
  fetchFriendsError: string | null;
  friendshipActionLoading: {
    profileId?: number;
    friendshipId?: number;
    loading: boolean;
  };
  friendRequestsError: string | null;
}

export const initialProfileState: ProfileState = {
  searchProfilesError: "",
  searchProfilesLoading: false,
  searchProfilesResult: {
    data: [],
    pagination: {
      page: 0,
      totalCount: 0,
    },
  },
  friendRequests: {
    data: [],
    pagination: {
      page: 0,
      totalCount: 0,
    },
  },
  friends: {
    data: [],
    pagination: {
      page: 0,
      totalCount: 0,
    },
  },
  fetchProfileLoading: false,
  selectedProfile: null,
  fetchProfileError: null,
  fetchFriendsLoading: false,
  fetchFriendsError: null,
  friendshipActionLoading: {
    loading: false,
  },
  friendRequestsLoading: false,
  friendRequestsError: null,
};
