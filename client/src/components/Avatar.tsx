import { useMemo } from "react";
import { AuthUser } from "../models/auth-user.model";
import { Profile } from "../models/profile.model";
import DefaultProfilePhoto from "./DefaultProfilePhoto";

type Props = {
  user: AuthUser | Profile;
  className?: string;
  showInitialsIfPhotoDoesNotExist?: boolean;
};

const Avatar = ({
  user,
  className,
  showInitialsIfPhotoDoesNotExist,
}: Props) => {
  const initials = useMemo<string>(() => {
    const names = user.name.split(" ");
    if (names.length > 1) {
      const [[firstLetter], [secondLetter]] = names;
      return `${firstLetter}${secondLetter}`;
    }

    if (user.name.length >= 2) {
      return `${user.name[0]}${user.name[1]}`;
    }

    return user.name[0];
  }, [user]);

  if (user.profilePhotoUrl) {
    return (
      <img
        className={`inline-block ${className?.includes("w-") ? "" : "w-10"} ${
          className?.includes("h-") ? "" : "h-10"
        } rounded-full ring-2 ring-white dark:ring-neutral-600 object-cover ${
          className ?? className
        }`}
        src={user.profilePhotoUrl}
        alt={user.name}
      />
    );
  }
  return showInitialsIfPhotoDoesNotExist ? (
    <div
      className={`w-10 h-10 relative flex justify-center items-center rounded-full bgPrimary text-xl text-white uppercase cursor-pointer ${className}`}
    >
      {initials}
    </div>
  ) : (
    <DefaultProfilePhoto
      className={`${className?.includes("w-") ? className : "w-10"} ${
        className?.includes("h-") ? className : "h-10"
      }`}
    />
  );
};

export default Avatar;
