import { createAction } from "@reduxjs/toolkit";
import { Like } from "../../models/like.model";
import { PaginationRequest } from "../../models/pagination-request.model";
import { PaginationResponse } from "../../models/pagination-response.model";
import { Post } from "../../models/post.model";
import { PostsTypes } from "./posts.types";

export const fetchPostsByUsernameStart = createAction<
  PaginationRequest & { username: string },
  PostsTypes.FETCH_POSTS_BY_USERNAME_START
>(PostsTypes.FETCH_POSTS_BY_USERNAME_START);

export const fetchPostsStart = createAction<
  PaginationRequest,
  PostsTypes.FETCH_POSTS_START
>(PostsTypes.FETCH_POSTS_START);

export const fetchPostsSuccess = createAction<
  { data: Post[]; pagination: PaginationResponse },
  PostsTypes.FETCH_POSTS_SUCCESS
>(PostsTypes.FETCH_POSTS_SUCCESS);

export const fetchPostsFailure = createAction<
  string,
  PostsTypes.FETCH_POSTS_FAILURE
>(PostsTypes.FETCH_POSTS_FAILURE);

export const deletePostStart = createAction<
  number,
  PostsTypes.DELETE_POST_START
>(PostsTypes.DELETE_POST_START);

export const deletePostSuccess = createAction<
  Post,
  PostsTypes.DELETE_POST_SUCCESS
>(PostsTypes.DELETE_POST_SUCCESS);

export const deletePostFailure = createAction<
  string,
  PostsTypes.DELETE_POST_FAILURE
>(PostsTypes.DELETE_POST_FAILURE);

export const addPostStart = createAction<Post, PostsTypes.ADD_POST_START>(
  PostsTypes.ADD_POST_START
);

export const resetPostsData = createAction<void, PostsTypes.RESET_POSTS_DATA>(
  PostsTypes.RESET_POSTS_DATA
);

export const addPostSuccess = createAction<Post, PostsTypes.ADD_POST_SUCCESS>(
  PostsTypes.ADD_POST_SUCCESS
);

export const addPostFailure = createAction<string, PostsTypes.ADD_POST_FAILURE>(
  PostsTypes.ADD_POST_FAILURE
);

export const likePostStart = createAction<number, PostsTypes.LIKE_POST_START>(
  PostsTypes.LIKE_POST_START
);

export const likePostSuccess = createAction<Like, PostsTypes.LIKE_POST_SUCCESS>(
  PostsTypes.LIKE_POST_SUCCESS
);

export const likePostFailure = createAction<
  string,
  PostsTypes.LIKE_POST_FAILURE
>(PostsTypes.LIKE_POST_FAILURE);

export const setDeletePostConfirmationDialogVisibility = createAction<
  { id: number | null; open: boolean },
  PostsTypes.SET_DELETE_POST_CONFIRMATION_DIALOG_VISIBILITY
>(PostsTypes.SET_DELETE_POST_CONFIRMATION_DIALOG_VISIBILITY);

export const fetchSelectedPostStart = createAction<
  string,
  PostsTypes.FETCH_SELECTED_POST_START
>(PostsTypes.FETCH_SELECTED_POST_START);

export const fetchSelectedPostSuccess = createAction<
  Post,
  PostsTypes.FETCH_SELECTED_POST_SUCCESS
>(PostsTypes.FETCH_SELECTED_POST_SUCCESS);

export const fetchSelectedPostFailure = createAction<
  string,
  PostsTypes.FETCH_SELECTED_POST_FAILURE
>(PostsTypes.FETCH_SELECTED_POST_FAILURE);
