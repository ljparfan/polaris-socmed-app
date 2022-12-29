import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchFriendRequestsStart } from "../redux/profile/profile.actions";
import {
  selectFriendRequestsData,
  selectFriendRequestsLoading,
  selectFriendRequestsPagination,
  selectShowLoadMoreFriendRequests,
} from "../redux/profile/profile.selectors";
import Avatar from "./Avatar";
import Button from "./Button";
import FriendshipAction from "./FriendshipAction";
import Spinner from "./Spinner";
type Props = {
  onClose: () => void;
};

const NotificationsPanel = ({ onClose }: Props) => {
  const friendRequests = useAppSelector(selectFriendRequestsData);
  const pagination = useAppSelector(selectFriendRequestsPagination);
  const loading = useAppSelector(selectFriendRequestsLoading);
  const showLoadMore = useAppSelector(selectShowLoadMoreFriendRequests);
  const dispatch = useAppDispatch();

  const getContent = useCallback(() => {
    if (loading && !friendRequests.length) {
      return (
        <div className="flex justify-center py-5">
          <Spinner />
        </div>
      );
    } else if (friendRequests.length === 0) {
      return (
        <div className="flex justify-center">
          <div className="textDefault font-semibold text-lg my-10">
            No notifications to display
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className="px-2 textDefault font-medium">
            Pending Friend Requests
          </div>
          <div className="max-h-80 overflow-y-auto overflow-x-hidden">
            {friendRequests.map((friendRequest) => (
              <div className="px-2 py-4 flex space-x-2" key={friendRequest.id}>
                <Link to={`/${friendRequest.profile.username}`}>
                  <Avatar user={friendRequest.profile} className="h-12 w-12" />
                </Link>
                <div className="flex flex-col space-x-reverse">
                  <Link
                    to={`/${friendRequest.profile.username}`}
                    className="textDefault font-semibold font-sm"
                  >
                    {friendRequest.profile.name}
                  </Link>
                  <Link
                    to={`/${friendRequest.profile.username}`}
                    className="textDefault text-xs mb-2"
                  >
                    @{friendRequest.profile.username}
                  </Link>
                  <FriendshipAction
                    insidePanel
                    profile={friendRequest.profile}
                  />
                </div>
              </div>
            ))}
          </div>
          {showLoadMore && (
            <div className="flex justify-center pb-2">
              <Button
                loading={loading}
                onClick={() => {
                  dispatch(
                    fetchFriendRequestsStart({
                      pageNumber: pagination.page + 1,
                      pageSize: 5,
                    })
                  );
                }}
                className="rounded-2xl text-base font-medium text-gray-900 shadow-none hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                Show more
              </Button>
            </div>
          )}
        </>
      );
    }
  }, [loading, friendRequests, dispatch, pagination, showLoadMore]);

  return <div className="card p-2 overflow-hidden">{getContent()}</div>;
};

export default NotificationsPanel;
