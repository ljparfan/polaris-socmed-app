import { Friendship } from "../entities/friendship.entity";

export class ProfileResponse {
  id!: number;
  name!: string;
  topFriendsImageUrls: string[] = [];
  username!: string;
  key!: string;
  profilePhotoUrl?: string;
  friendshipWithCurrentUser: Friendship;
  isCurrentUser: boolean;
}
