import { createReducer } from "@reduxjs/toolkit";
import {
  addPostFailure,
  addPostStart,
  addPostSuccess,
  deletePostFailure,
  deletePostStart,
  deletePostSuccess,
  fetchPostsFailure,
  fetchPostsStart,
  fetchPostsSuccess,
  fetchSelectedPostFailure,
  fetchSelectedPostStart,
  fetchSelectedPostSuccess,
  likePostFailure,
  likePostSuccess,
  resetPostsData,
  setDeletePostConfirmationDialogVisibility,
} from "./posts.actions";
import { initialPostsState } from "./posts.state";

const postsReducer = createReducer(initialPostsState, (builder) =>
  builder
    .addCase(fetchPostsStart, (state, _action) => {
      state.fetchPostsLoading = true;
    })
    .addCase(fetchPostsSuccess, (state, action) => {
      state.fetchPostsLoading = false;
      state.selectedPost = null;
      state.posts = {
        pagination: action.payload.pagination,
        data:
          action.payload.pagination.page === 1
            ? action.payload.data
            : [...state.posts.data, ...action.payload.data],
      };
    })
    .addCase(fetchPostsFailure, (state, action) => {
      state.error = action.payload;
      state.fetchPostsLoading = false;
    })
    .addCase(addPostStart, (state, _action) => {
      state.addPostLoading = true;
    })
    .addCase(addPostSuccess, (state, action) => {
      state.addPostLoading = false;
      state.posts.data = [action.payload, ...state.posts.data];
    })
    .addCase(addPostFailure, (state, action) => {
      state.error = action.payload;
      state.addPostLoading = false;
    })
    .addCase(likePostSuccess, (state, action) => {
      state.posts.data = state.posts.data.map((post) => {
        if (post.id === action.payload.postId) {
          post.likesCount = action.payload.deletedAt
            ? post.likesCount - 1
            : post.likesCount + 1;
          post.likedByCurrentUser = action.payload.deletedAt ? false : true;
        }

        return post;
      });

      if (
        state.selectedPost &&
        action.payload.postId === state.selectedPost.id
      ) {
        const newSelectedPost = Object.create(state.selectedPost);

        newSelectedPost.likesCount = action.payload.deletedAt
          ? state.selectedPost.likesCount - 1
          : state.selectedPost.likesCount + 1;
        newSelectedPost.likedByCurrentUser = action.payload.deletedAt
          ? false
          : true;

        state.selectedPost = newSelectedPost;
      }
    })
    .addCase(likePostFailure, (state, action) => {
      state.error = action.payload;
    })
    .addCase(deletePostStart, (state, _action) => {
      state.deletePostLoading = true;
    })
    .addCase(resetPostsData, (state, _action) => {
      state.posts = {
        data: [],
        pagination: {
          page: 1,
          totalCount: 0,
        },
      };
    })
    .addCase(deletePostSuccess, (state, action) => {
      state.deletePostLoading = false;
      state.posts.data = state.posts.data.filter(
        (post) => post.id !== action.payload.id
      );

      if (action.payload.id === state.selectedPost?.id) {
        state.selectedPost = null;
      }
    })
    .addCase(deletePostFailure, (state, action) => {
      state.error = action.payload;
      state.deletePostLoading = false;
    })
    .addCase(fetchSelectedPostStart, (state, _action) => {
      state.fetchSelectedPostLoading = true;
    })
    .addCase(fetchSelectedPostSuccess, (state, action) => {
      state.fetchSelectedPostLoading = false;
      state.selectedPost = action.payload;
    })
    .addCase(fetchSelectedPostFailure, (state, action) => {
      state.error = action.payload;
      state.fetchSelectedPostLoading = false;
    })
    .addCase(setDeletePostConfirmationDialogVisibility, (state, action) => {
      state.deletePostConfirmationVisible = action.payload.open;
      state.postIdToBeDeleted = action.payload.id;
    })
);

export default postsReducer;
