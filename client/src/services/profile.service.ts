import { Friendship } from "../models/friendship.model";
import { PaginationRequest } from "../models/pagination-request.model";
import { PaginationResponse } from "../models/pagination-response.model";
import { Profile } from "../models/profile.model";
import http from "./http.service";

export const searchProfiles = (
  keyword: string,
  pagination: PaginationRequest
) => {
  return http
    .get<{ data: Profile[]; pagination: PaginationResponse }>("/profiles", {
      params: {
        pageSize: pagination.pageSize ?? 5,
        pageNumber: pagination.pageNumber,
        searchQuery: keyword,
      },
    })
    .then((response) => response.data);
};

export const fetchProfile = (username: string) => {
  return http
    .get<Profile>(`/profiles/${username}`)
    .then((response) => response.data);
};

export const fetchProfileFriends = (
  username: string,
  pagination: PaginationRequest
) => {
  return http
    .get<{ data: Profile[]; pagination: PaginationResponse }>(
      `/profiles/${username}/friends`,
      {
        params: {
          pageSize: pagination.pageSize ?? 5,
          pageNumber: pagination.pageNumber,
        },
      }
    )
    .then((response) => response.data);
};

export const fetchReceivedFriendRequests = (pagination: PaginationRequest) => {
  return http
    .get<{
      data: { id: number; key: string; profile: Profile }[];
      pagination: PaginationResponse;
    }>("/friendships", {
      params: {
        pageSize: pagination.pageSize ?? 5,
        pageNumber: pagination.pageNumber,
        status: "PENDING",
      },
    })
    .then((response) => response.data);
};

export const addFriend = (profileId: number) =>
  http
    .post<Friendship>("/friendships", {
      requesteeId: profileId,
    })
    .then((response) => response.data);

export const cancelFriendRequest = (friendshipId: number) =>
  http
    .delete<Friendship>(`/friendships/${friendshipId}`)
    .then((response) => response.data);

export const acceptFriendRequest = (friendshipId: number) =>
  http
    .put<Friendship>(`/friendships/${friendshipId}`, {
      status: "ACCEPTED",
    })
    .then((response) => response.data);

export const rejectedFriendRequest = (friendshipId: number) =>
  http
    .put<Friendship>(`/friendships/${friendshipId}`, {
      status: "REJECTED",
    })
    .then((response) => response.data);
