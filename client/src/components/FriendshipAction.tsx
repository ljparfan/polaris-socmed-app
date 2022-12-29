import { Menu, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  UserAddIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { UserRemoveIcon as UserRemoveIconOutlined } from "@heroicons/react/solid";
import { Fragment, useMemo } from "react";
import { FriendshipStatus } from "../models/friendship-status.enum";
import { Profile } from "../models/profile.model";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  acceptFriendRequestStart,
  cancelFriendRequestStart,
  rejectFriendRequestStart,
  removeFriendStart,
  sendFriendRequestStart,
} from "../redux/profile/profile.actions";
import {
  selectFriendshipWithCurrentUser,
  selectIsFriendshipActionLoading,
} from "../redux/profile/profile.selectors";
import Button from "./Button";
import Spinner from "./Spinner";

type Props = {
  profile: Profile;
  insidePanel?: boolean;
};

const FriendshipAction = ({ profile, insidePanel = false }: Props) => {
  const dispatch = useAppDispatch();
  const friendshipWithCurrentUser = useAppSelector(
    selectFriendshipWithCurrentUser(profile)
  );
  const loading = useAppSelector(selectIsFriendshipActionLoading(profile.id));

  const menuItems = useMemo(() => {
    switch (friendshipWithCurrentUser as FriendshipStatus) {
      case FriendshipStatus.ACCEPTED:
        return [
          {
            text: "Unfriend",
            Icon: UserRemoveIconOutlined,
            action: () => {
              dispatch(
                removeFriendStart({
                  profileId: profile.id,
                  friendshipId: profile.friendshipWithCurrentUser?.id,
                })
              );
            },
          },
        ];
      case FriendshipStatus.PENDING_SENT:
        return [
          {
            text: "Cancel Request",
            Icon: XCircleIcon,
            action: () => {
              dispatch(
                cancelFriendRequestStart({
                  profileId: profile.id,
                  friendshipId: profile.friendshipWithCurrentUser!.id,
                })
              );
            },
          },
        ];
      case FriendshipStatus.PENDING_RECEIVED:
        return [
          {
            text: "Accept Request",
            Icon: CheckCircleIcon,
            action: () => {
              dispatch(
                acceptFriendRequestStart({
                  profileId: profile.id,
                  friendshipId: profile.friendshipWithCurrentUser!.id,
                })
              );
            },
          },
          {
            text: "Decline Request",
            Icon: XCircleIcon,
            action: () => {
              dispatch(
                rejectFriendRequestStart({
                  profileId: profile.id,
                  friendshipId: profile.friendshipWithCurrentUser!.id,
                })
              );
            },
          },
        ];

      default:
        return [
          {
            text: "Add Friend",
            Icon: UserAddIcon,
            action: () => {
              dispatch(
                sendFriendRequestStart({
                  profileId: profile.id,
                })
              );
            },
          },
        ];
    }
  }, [dispatch, profile, friendshipWithCurrentUser]);

  if (profile.isCurrentUser) {
    return null;
  }

  if (loading) {
    return (
      <div>
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (insidePanel) {
    return (
      <div className="flex space-x-3">
        {menuItems.map(({ action, text }) => (
          <Button
            key={text}
            onClick={action}
            loading={loading}
            className={
              text === "Accept Request"
                ? "bgPrimary flex items-center text-sm font-medium bgPrimaryHover"
                : `bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white flex items-center text-sm font-medium hover:bg-neutral-300 ${
                    loading ? "px-14" : ""
                  }`
            }
          >
            <span>{text.replace("Request", "")}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="menuItemIconButton">
          <DotsHorizontalIcon className="menuItemIconButtonIcon" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="card origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg">
          <div className="py-1">
            {menuItems.map(({ action, text, Icon }) => (
              <Menu.Item key="text">
                {({ active }) => (
                  <button
                    onClick={action}
                    className="flex items-center space-x-2 w-full hover:bg-gray-50 dark:hover:bg-neutral-600 rounded-lg cursor-pointer px-4 py-2"
                  >
                    <div className="menuItemIconButton">
                      <Icon className="menuItemIconButtonIcon" />
                    </div>
                    <span>{text}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default FriendshipAction;
