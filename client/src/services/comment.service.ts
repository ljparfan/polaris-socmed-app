import { Like } from "../models/like.model";
import { PaginationRequest } from "../models/pagination-request.model";
import http from "./http.service";

export const fetchComments = (
  postKey: string,
  pagination: PaginationRequest
) => {
  return http
    .get<Comment>(`/posts/${postKey}/comments`, {
      params: {
        pageSize: pagination.pageSize ?? 5,
        pageNumber: pagination.pageNumber,
      },
    })
    .then((response) => response.data);
};

export const addComment = (postKey: string, comment: string) => {
  return http
    .post<Comment>(`/posts/${postKey}/comments`, {
      value: comment,
    })
    .then((response) => response.data);
};

export const deleteComment = (postKey: string, commentId: number) => {
  return http
    .delete<Comment>(`/posts/${postKey}/comments/${commentId}`)
    .then((response) => response.data);
};

export const likeComment = (id: number) => {
  return http.post<Like>("/likes", { commentId: id }).then(({ data }) => data);
};
