import { Popover, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/solid";
import React, { Fragment } from "react";
import { selectCurrentUser } from "../redux/auth/auth.selectors";
import { useAppSelector } from "../redux/hooks";
import { selectFriendRequestsTotalCount } from "../redux/profile/profile.selectors";
import Badge from "./Badge";
import NotificationsPanel from "./NotificationsPanel";

type Props = {};

const NotificationIconButton = (props: Props) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const count = useAppSelector(selectFriendRequestsTotalCount);

  return (
    <Popover.Group as="nav" className="relative inline-block text-left mr-2">
      <Popover className="relative">
        {({ open }) => (
          <>
            {currentUser && (
              <Popover.Button className="flex items-center menuItemIconButton">
                <BellIcon className="menuItemIconButtonIcon" />
                {count > 0 && (
                  <Badge className="bg-red-700">
                    {count > 99 ? "99+" : count}
                  </Badge>
                )}
              </Popover.Button>
            )}

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 -ml-64 w-80">
                {({ close }) => <NotificationsPanel onClose={close} />}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </Popover.Group>
  );
};

export default NotificationIconButton;
