import { Fragment, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchProfileStart,
  resetSelectedProfile,
} from "../redux/profile/profile.actions";
import { Outlet, useLocation, useParams } from "react-router-dom";
import {
  selectIsSelectedProfileCurrentUser,
  selectIsSelectedProfileFetching,
  selectSelectedProfile,
} from "../redux/profile/profile.selectors";
import Divider from "../components/Divider";
import ProfileHeader from "../components/ProfileHeader";
import { Link } from "react-router-dom";
import FullPageSpinner from "../components/FullPageSpinner";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectSelectedProfile);
  const loading = useAppSelector(selectIsSelectedProfileFetching);
  const { username } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (profile) {
      document.title = profile.name;
    }

    return () => {
      document.title = "Polaris";
    };
  }, [profile]);

  useEffect(() => {
    if (username && username !== "me") {
      dispatch(fetchProfileStart(username));
    }
  }, [dispatch, username]);

  useEffect(() => {
    return () => {
      dispatch(resetSelectedProfile());
    };
  }, [dispatch]);

  const isCurrentUser = useAppSelector(selectIsSelectedProfileCurrentUser);

  return loading ? (
    <FullPageSpinner />
  ) : (
    <Tab.Group
      as="div"
      className="w-full"
      defaultIndex={location.pathname.includes("friends") ? 1 : 0}
    >
      <div>
        <div className="sticky top-16 z-40">
          <main className="flex flex-col items-center pt-9 dark:text-white bg-white dark:bg-neutral-800">
            <div className="w-full md:w-1/2">
              {profile && (
                <ProfileHeader
                  profile={profile}
                  isCurrentUser={isCurrentUser!}
                />
              )}
              <Divider className="mt-5 " />
              <Tab.List className="-mb-px flex px-4 space-x-8 w-1/12">
                <Link to="">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        selected
                          ? "textPrimary borderPrimary"
                          : "textDefault border-transparent",
                        "flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium"
                      )
                    }
                  >
                    Posts
                  </Tab>
                </Link>
                <Link to="friends">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        selected
                          ? "textPrimary borderPrimary"
                          : "textDefault border-transparent",
                        "flex-1 whitespace-nowrap py-4 px-1 border-b-2 text-base font-medium"
                      )
                    }
                  >
                    Friends
                  </Tab>
                </Link>
              </Tab.List>
            </div>
          </main>
          <Divider className="mx-0 my-0 border-b-2" />
        </div>
        <Tab.Panels as={Fragment}>
          <Outlet />
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
};

export default ProfilePage;
