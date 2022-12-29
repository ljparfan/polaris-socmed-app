import React from "react";
import { Link } from "react-router-dom";
import { Profile } from "../models/profile.model";
import Avatar from "./Avatar";
import FriendshipAction from "./FriendshipAction";

type Props = {
  profile: Profile;
};

const FriendListItem = ({ profile }: Props) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Link to={`/${profile.username}`}>
        <Avatar user={profile} className="h-12 w-12" />
      </Link>
      <div className="flex justify-between w-full">
        <div className="flex flex-col space-x-reverse">
          <Link
            to={`/${profile.username}`}
            className="textDefault font-semibold font-sm"
          >
            {profile.name}
          </Link>
          <Link
            to={`/${profile.username}`}
            className="textDefault text-xs mb-2"
          >
            @{profile.username}
          </Link>
        </div>
        <FriendshipAction profile={profile} />
      </div>
    </div>
  );
};

export default FriendListItem;
