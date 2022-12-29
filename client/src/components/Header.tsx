import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { SearchIcon, ArrowLeftIcon } from "@heroicons/react/solid";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import logo from "../assets/polaris-logos_transparent.png";
import SearchBar from "./SearchBar";
import { selectFullSizeSearchboxVisibility } from "../redux/general/general.selectors";
import {
  hideFullSizeSearchbox,
  showFullSizeSearchbox,
} from "../redux/general/general.actions";
import CurrentUserMenu from "./CurrentUserMenu";
import NotificationIconButton from "./NotificationIconButton";

const Header = () => {
  const dispatch = useAppDispatch();
  const fullWidthSearchBarVisible = useAppSelector(
    selectFullSizeSearchboxVisibility
  );

  return (
    <Disclosure
      as="nav"
      className="bg-white sticky top-0 z-50 shadow-md dark:bg-neutral-800 dark:border dark:border-neutral-700"
    >
      {({ open }) => (
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          {fullWidthSearchBarVisible ? (
            <div className="flex flex-row items-center">
              <button
                className="p-2"
                onClick={() => dispatch(hideFullSizeSearchbox())}
              >
                <ArrowLeftIcon className="h-5 textDefault" />
              </button>
              <div className="w-full">
                <SearchBar />
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-between h-16">
              <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                <Link to="/">
                  <div className="flex-shrink-0 flex items-center cursor-pointer">
                    <img
                      className="block h-14 lg:h-20 w-auto"
                      src={logo}
                      alt="Workflow"
                    />
                  </div>
                </Link>
              </div>
              <div className="md:hidden flex items-center">
                <button
                  className="menuItemIconButton"
                  onClick={() => dispatch(showFullSizeSearchbox())}
                >
                  <SearchIcon className="menuItemIconButtonIcon" />
                </button>
              </div>
              <div className="flex-1 sm:block sm:ml-6">
                <div className="hidden md:block">
                  <SearchBar />
                </div>
              </div>

              <NotificationIconButton />
              <div className="flex items-center ml-2">
                {/* Profile dropdown */}
                <CurrentUserMenu />
              </div>
            </div>
          )}
        </div>
      )}
    </Disclosure>
  );
};

export default Header;
