import { AuthUser } from "./auth-user.model";
import { BaseModel } from "./base.model";
import { Post } from "./post.model";

export interface Comment extends BaseModel {
  post: Post;
  user: AuthUser;
  value: string;
  likesCount: number;
  likedByCurrentUser: boolean;
}
