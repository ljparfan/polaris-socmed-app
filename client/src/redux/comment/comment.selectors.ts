import { createSelector } from "reselect";
import { RootState } from "../store";

const selectComment = (state: RootState) => state.comment;

export const selectComments = createSelector(
  [selectComment],
  ({ comments }) => comments
);

export const selectRemainingCommentsToFetch = createSelector(
  [selectComment],
  ({ comments: { data, pagination } }) => {
    const currentCount = data.length;
    const totalCount = pagination.totalCount;

    const remaining = totalCount - currentCount;

    if (remaining < 1) {
      return 0;
    }

    return remaining;
  }
);

export const selectCommentsVisibility = createSelector(
  [selectComments],
  (comments) => comments.visible
);

export const selectCommentsCount = createSelector(
  [selectComments],
  (comments) => comments.pagination.totalCount
);
