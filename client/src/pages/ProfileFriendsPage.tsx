import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import FriendListItem from "../components/FriendListItem";
import Spinner from "../components/Spinner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProfileFriendsStart } from "../redux/profile/profile.actions";
import {
  selectFriendsData,
  selectFriendsLoading,
  selectFriendsPagination,
  selectHasMoreFriendsToFetch,
} from "../redux/profile/profile.selectors";

type Props = {};

const ProfileFriendsPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const friends = useAppSelector(selectFriendsData);
  const loading = useAppSelector(selectFriendsLoading);
  const pagination = useAppSelector(selectFriendsPagination);
  const hasMoreFriendsToFetch = useAppSelector(selectHasMoreFriendsToFetch);

  useEffect(() => {
    if (username && username !== "me") {
      dispatch(
        fetchProfileFriendsStart({
          username,
          pagination: { pageNumber: 1, pageSize: 20 },
        })
      );
    }
  }, [username, dispatch]);

  const observer = useRef<any>();

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreFriendsToFetch &&
          username &&
          username !== "me"
        ) {
          dispatch(
            fetchProfileFriendsStart({
              username,
              pagination: { pageNumber: pagination.page + 1, pageSize: 20 },
            })
          );
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMoreFriendsToFetch, dispatch, pagination, username]
  );

  if (pagination.page === 1 && loading) {
    return (
      <div className="w-full flex items-center justify-center mt-12">
        <Spinner />
      </div>
    );
  } else if (friends.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="textDefault font-semibold text-lg my-10">
          No friends to display
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center px-2">
      <div className="w-full md:w-1/2 card mt-7 p-5">
        <div className="grid grid-cols-12">
          {friends.map((profile, index) => (
            <div
              ref={
                friends.length === index + 1 ? lastPostElementRef : undefined
              }
              className="col-span-12 md:col-span-6 px-4 my-6"
              key={profile.id}
            >
              <FriendListItem profile={profile} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProfileFriendsPage;
