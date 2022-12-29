import { AuthUser } from "./auth-user.model";
import { BaseModel } from "./base.model";
import { Photo } from "./photo.model";

export interface Post extends BaseModel {
  value: string;
  userId: number;
  likesCount: number;
  commentsCount: number;
  user?: AuthUser;
  likedByCurrentUser: boolean;
  photos: Photo[];
  photoFiles?: File[];
}
