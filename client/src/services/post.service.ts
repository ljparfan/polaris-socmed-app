import { Like } from "../models/like.model";
import { PaginationRequest } from "../models/pagination-request.model";
import { PaginationResponse } from "../models/pagination-response.model";
import { Post } from "../models/post.model";
import http from "./http.service";

export const fetchPosts = (pagination: PaginationRequest) => {
  return http
    .get<{ data: Post[]; pagination: PaginationResponse }>("/posts", {
      params: {
        pageSize: pagination.pageSize ?? 5,
        pageNumber: pagination.pageNumber,
      },
    })
    .then((response) => response.data);
};

export const addPost = (post: Post) => {
  const formData = new FormData();
  if (post.photoFiles && post.photoFiles.length) {
    for (const photoFile of post.photoFiles) {
      formData.append("photos", photoFile);
    }
  }

  formData.append("value", post.value);
  return http.post<Post>("/posts", formData).then(({ data }) => data);
};

export const deletePost = (id: number) => {
  return http.delete<Post>(`/posts/${id}`).then(({ data }) => data);
};

export const likePost = (id: number) => {
  return http.post<Like>("/likes", { postId: id }).then(({ data }) => data);
};

export const fetchPost = (key: string) => {
  return http.get<Post>(`/posts/${key}`).then((response) => response.data);
};

export const fetchPostsByUsername = (
  username: string,
  pagination: PaginationRequest
) => {
  return http
    .get<{ data: Post[]; pagination: PaginationResponse }>(
      `/profiles/${username}/posts`,
      {
        params: {
          pageSize: pagination.pageSize ?? 5,
          pageNumber: pagination.pageNumber,
        },
      }
    )
    .then((response) => response.data);
};
