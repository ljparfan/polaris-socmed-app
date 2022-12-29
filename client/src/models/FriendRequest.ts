import { Profile } from "./profile.model";

export interface FriendRequest {
  id: number;
  key: string;
  profile: Profile;
}
