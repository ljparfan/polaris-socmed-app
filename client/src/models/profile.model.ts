import { Friendship } from "./friendship.model";

export interface Profile {
  id: number;
  name: string;
  topFriendsImageUrls: string[];
  username: string;
  key: string;
  profilePhotoUrl?: string;
  friendshipWithCurrentUser?: Friendship;
  isCurrentUser: boolean;
}
