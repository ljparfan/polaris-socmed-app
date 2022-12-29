import { Comment } from "../../models/comment.model";
import { PaginationResponse } from "../../models/pagination-response.model";

// Define a type for the slice state
export interface CommentState {
  fetchCommentsLoading: boolean;
  fetchCommentsError: string;
  addCommentError: string;
  deleteCommentError: string;
  likeCommentError: string;
  comments: {
    data: Comment[];
    pagination: PaginationResponse;
    visible: boolean;
  };
}

// Define the initial state using that type
export const initialCommentState: CommentState = {
  fetchCommentsLoading: false,
  fetchCommentsError: "",
  addCommentError: "",
  likeCommentError: "",
  deleteCommentError: "",
  comments: {
    data: [],
    pagination: {
      page: 1,
      totalCount: 0,
    },
    visible: true,
  },
};
