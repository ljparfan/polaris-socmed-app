import { createSelector } from "reselect";
import { RootState } from "../store";

const selectPosts = (state: RootState) => state.posts;

export const selectPostsData = createSelector(
  [selectPosts],
  ({ posts }) => posts.data
);

export const selectPostsLoading = createSelector(
  [selectPosts],
  ({ fetchPostsLoading }) => fetchPostsLoading
);

export const selectAddPostLoading = createSelector(
  [selectPosts],
  ({ addPostLoading }) => addPostLoading
);

export const selectDeletePostConfirmationDialogVisibility = createSelector(
  [selectPosts],
  ({ deletePostConfirmationVisible }) => deletePostConfirmationVisible
);

export const selectPostIdToDelete = createSelector(
  [selectPosts],
  ({ postIdToBeDeleted }) => postIdToBeDeleted
);

export const selectHasMorePostsToFetch = createSelector(
  [selectPosts],
  ({ posts }) => posts.data.length < posts.pagination.totalCount
);

export const selectPostsCurrentPage = createSelector(
  [selectPosts],
  ({ posts }) => posts.pagination.page
);

export const selectSelectedPost = createSelector(
  [selectPosts],
  ({ selectedPost }) => selectedPost
);

export const selectFetchSelectedPostLoading = createSelector(
  [selectPosts],
  ({ fetchSelectedPostLoading }) => fetchSelectedPostLoading
);
