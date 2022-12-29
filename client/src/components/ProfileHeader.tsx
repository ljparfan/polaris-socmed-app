import Avatar from "./Avatar";
import { Profile } from "../models/profile.model";
import FriendshipAction from "./FriendshipAction";
import { useAppDispatch } from "../redux/hooks";
import { openFullSizePhotoViewer } from "../redux/general/general.actions";

type Props = {
  profile: Profile;
  isCurrentUser: boolean;
};

const ProfileHeader = ({ profile, isCurrentUser }: Props) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex md:justify-between items-center md:flex-row flex-col justify-center space-y-3">
      <div className="flex items-center space-x-5 md:flex-row flex-col justify-center text-center">
        <div
          className="cursor-pointer"
          onClick={() => {
            if (profile.profilePhotoUrl) {
              dispatch(openFullSizePhotoViewer(profile.profilePhotoUrl));
            }
          }}
        >
          <Avatar user={profile} className="h-44 w-44 text-6xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-4xl font-bold">{profile.name}</span>
        </div>
      </div>
      {!isCurrentUser && <FriendshipAction profile={profile} />}
    </div>
  );
};

export default ProfileHeader;
