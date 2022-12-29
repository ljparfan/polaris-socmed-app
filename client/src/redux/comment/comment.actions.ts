import { createAction } from "@reduxjs/toolkit";
import { Comment } from "../../models/comment.model";
import { Like } from "../../models/like.model";
import { PaginationRequest } from "../../models/pagination-request.model";
import { PaginationResponse } from "../../models/pagination-response.model";
import { CommentTypes } from "./comment.types";

export const fetchCommentsStart = createAction<
  { postKey: string; pagination: PaginationRequest },
  CommentTypes.FETCH_COMMENTS_START
>(CommentTypes.FETCH_COMMENTS_START);

export const fetchCommentsSuccess = createAction<
  { data: Comment[]; pagination: PaginationResponse },
  CommentTypes.FETCH_COMMENTS_SUCCESS
>(CommentTypes.FETCH_COMMENTS_SUCCESS);

export const fetchCommentsFailure = createAction<
  string,
  CommentTypes.FETCH_COMMENTS_FAILURE
>(CommentTypes.FETCH_COMMENTS_FAILURE);

export const addCommentStart = createAction<
  { postKey: string; commentValue: string },
  CommentTypes.ADD_COMMENT_START
>(CommentTypes.ADD_COMMENT_START);

export const addCommentSuccess = createAction<
  Comment,
  CommentTypes.ADD_COMMENT_SUCCESS
>(CommentTypes.ADD_COMMENT_SUCCESS);

export const addCommentFailure = createAction<
  string,
  CommentTypes.ADD_COMMENT_FAILURE
>(CommentTypes.ADD_COMMENT_FAILURE);

export const deleteCommentStart = createAction<
  { postKey: string; commentId: number },
  CommentTypes.DELETE_COMMENT_START
>(CommentTypes.DELETE_COMMENT_START);

export const deleteCommentSuccess = createAction<
  Comment,
  CommentTypes.DELETE_COMMENT_SUCCESS
>(CommentTypes.DELETE_COMMENT_SUCCESS);

export const deleteCommentFailure = createAction<
  string,
  CommentTypes.DELETE_COMMENT_FAILURE
>(CommentTypes.DELETE_COMMENT_FAILURE);

export const likeCommentStart = createAction<
  number,
  CommentTypes.LIKE_COMMENT_START
>(CommentTypes.LIKE_COMMENT_START);

export const likeCommentSuccess = createAction<
  Like,
  CommentTypes.LIKE_COMMENT_SUCCESS
>(CommentTypes.LIKE_COMMENT_SUCCESS);

export const likeCommentFailure = createAction<
  string,
  CommentTypes.LIKE_COMMENT_FAILURE
>(CommentTypes.LIKE_COMMENT_FAILURE);

export const toggleCommentsVisibility = createAction<
  void,
  CommentTypes.TOGGLE_COMMENTS_VISIBILITY
>(CommentTypes.TOGGLE_COMMENTS_VISIBILITY);
