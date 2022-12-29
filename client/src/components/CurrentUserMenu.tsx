import { Popover, Transition } from "@headlessui/react";
import { LogoutIcon, MoonIcon, SunIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { signOutStart } from "../redux/auth/auth.actions";
import { selectCurrentUser } from "../redux/auth/auth.selectors";
import { toggleDarkTheme } from "../redux/general/general.actions";
import { selectDarkThemeEnabled } from "../redux/general/general.selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Avatar from "./Avatar";
import CurrentUserMenuHeader from "./CurrentUserMenuHeader";
import CurrentUserMenuItem from "./CurrentUserMenuItem";
import Divider from "./Divider";

const CurrentUserMenu = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const darkThemeEnabled = useAppSelector(selectDarkThemeEnabled);
  const dispatch = useAppDispatch();

  return (
    <Popover.Group as="nav" className="relative inline-block text-left">
      <Popover className="relative">
        {({ open }) => (
          <>
            {currentUser && (
              <Popover.Button className="flex justify-center items-center w-full rounded-2xl ">
                <Avatar
                  user={currentUser}
                  showInitialsIfPhotoDoesNotExist={true}
                />
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
              <Popover.Panel className="absolute z-10 -ml-72 w-80">
                {({ close }) => (
                  <div className="card p-2 overflow-hidden">
                    <CurrentUserMenuHeader
                      currentUser={currentUser}
                      onClose={close}
                    />
                    <Divider />
                    <CurrentUserMenuItem
                      component="button"
                      icon={darkThemeEnabled ? SunIcon : MoonIcon}
                      text="Toggle Dark Theme"
                      onClose={close}
                      onClick={() => dispatch(toggleDarkTheme())}
                    />
                    <CurrentUserMenuItem
                      component="button"
                      icon={LogoutIcon}
                      text="Log Out"
                      onClose={close}
                      onClick={() => dispatch(signOutStart())}
                    />
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </Popover.Group>
  );
};

export default CurrentUserMenu;
