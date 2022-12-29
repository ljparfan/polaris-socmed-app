import { BaseModel } from "./base.model";
import { Post } from "./post.model";

export interface Like extends BaseModel {
  post?: Post;
  postId?: number;
  commentId?: number;
  comment?: Comment;
  userId?: number;
}
