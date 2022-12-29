import { PaginationResponse } from "../../models/pagination-response.model";
import { Post } from "../../models/post.model";

export interface PostsState {
  deletePostConfirmationVisible: boolean;
  fetchPostsLoading: boolean;
  selectedPost: Post | null;
  fetchSelectedPostLoading: boolean;
  addPostLoading: boolean;
  postIdToBeDeleted: number | null;
  deletePostLoading: boolean;
  error: string | null;
  posts: {
    data: Post[];
    pagination: PaginationResponse;
  };
}

export const initialPostsState: PostsState = {
  deletePostConfirmationVisible: false,
  postIdToBeDeleted: null,
  selectedPost: null,
  posts: {
    data: [],
    pagination: {
      totalCount: 0,
      page: 1,
    },
  },
  error: null,
  fetchPostsLoading: false,
  deletePostLoading: false,
  addPostLoading: false,
  fetchSelectedPostLoading: false,
};
