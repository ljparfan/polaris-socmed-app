import { createReducer } from "@reduxjs/toolkit";
import {
  addCommentFailure,
  addCommentSuccess,
  deleteCommentFailure,
  deleteCommentSuccess,
  fetchCommentsFailure,
  fetchCommentsStart,
  fetchCommentsSuccess,
  likeCommentFailure,
  likeCommentSuccess,
  toggleCommentsVisibility,
} from "./comment.actions";
import { initialCommentState } from "./comment.state";

const commentReducer = createReducer(initialCommentState, (builder) =>
  builder
    .addCase(fetchCommentsStart, (state, _action) => {
      state.fetchCommentsLoading = true;
    })
    .addCase(fetchCommentsSuccess, (state, action) => {
      state.comments = {
        pagination: action.payload.pagination,
        data:
          action.payload.pagination.page === 1
            ? action.payload.data
            : [...state.comments.data, ...action.payload.data],
        visible: true,
      };
    })
    .addCase(fetchCommentsFailure, (state, action) => {
      state.fetchCommentsError = action.payload;
    })
    .addCase(addCommentSuccess, (state, action) => {
      state.comments = {
        ...state.comments,
        data: [...state.comments.data, action.payload],
        pagination: {
          ...state.comments.pagination,
          totalCount: state.comments.pagination.totalCount + 1,
        },
      };
    })
    .addCase(addCommentFailure, (state, action) => {
      state.addCommentError = action.payload;
    })
    .addCase(likeCommentSuccess, (state, action) => {
      state.comments.data = state.comments.data.map((comment) => {
        if (comment.id === action.payload.commentId) {
          comment.likesCount = action.payload.deletedAt
            ? comment.likesCount - 1
            : (comment.likesCount || 0) + 1;
          comment.likedByCurrentUser = action.payload.deletedAt ? false : true;
        }

        return comment;
      });
    })
    .addCase(likeCommentFailure, (state, action) => {
      state.likeCommentError = action.payload;
    })
    .addCase(deleteCommentSuccess, (state, action) => {
      const { comments } = state;
      const { pagination } = comments;
      state.comments = {
        ...state.comments,
        pagination: {
          ...pagination,
          totalCount: pagination.totalCount - 1,
        },
        data: comments.data.filter(
          (comment) => comment.id !== action.payload.id
        ),
      };
    })
    .addCase(deleteCommentFailure, (state, action) => {
      state.deleteCommentError = action.payload;
    })
    .addCase(toggleCommentsVisibility, (state, _action) => {
      state.comments.visible = !state.comments.visible;
    })
);

export default commentReducer;
