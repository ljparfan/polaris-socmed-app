import { Transition } from "@headlessui/react";
import { ChatIcon, StarIcon } from "@heroicons/react/outline";
import { TrashIcon, StarIcon as StarSolidIcon } from "@heroicons/react/solid";
import { Fragment, ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Post as PostModel } from "../models/post.model";
import { toggleCommentsVisibility } from "../redux/comment/comment.actions";
import { selectCommentsCount } from "../redux/comment/comment.selectors";
import {
  openDialog,
  openFullSizePhotoViewer,
} from "../redux/general/general.actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deletePostStart, likePostStart } from "../redux/posts/posts.actions";
import Avatar from "./Avatar";
import FormattedDate from "./FormattedDate";

type Props = {
  post: PostModel;
  extras?: ReactNode;
};

const Post = ({ post, extras }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const commentsCount = useAppSelector(selectCommentsCount);
  const { id: postId } = useParams();
  return (
    <Transition
      show={true}
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <div className="card mt-5">
        <div className="flex flex-col">
          <div className="flex flex-col pt-5 pl-5 pr-5">
            <div className="flex flex-row justify-between space-x-2">
              <div className="flex flex-row space-x-2 items-center">
                <Link to={`/${post.user!.username}`}>
                  <Avatar user={post.user!} />
                </Link>
                <div>
                  <Link to={`/${post.user!.username}`}>
                    <p className="font-medium hover:underline">
                      {post.user!.name}
                    </p>
                  </Link>
                  <Link to={`/posts/${post.key}`}>
                    <FormattedDate
                      className="hover:text-gray-300 cursor-pointer dark:text-gray-200"
                      value={post.createdAt}
                    />
                  </Link>
                </div>
              </div>
              <div>
                <button
                  onClick={() =>
                    dispatch(
                      openDialog({
                        title: "Delete Post",
                        body: "Are you sure you want to delete your post? This post will be permanently removed. This action cannot be undone.",
                        visible: true,
                        actionButton: {
                          text: "Delete",
                          type: "error",
                        },
                        actionToBeFired: deletePostStart(post.id),
                      })
                    )
                  }
                  type="button"
                  className="p-1 rounded-full hover:bg-gray-200 text-gray-400 dark:text-neutral-400 dark:hover:bg-neutral-700"
                >
                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <p className="pt-4 pb-2">{post.value}</p>
          </div>
          <div
            className={`container mb-2 mx-auto space-y-2 lg:space-y-0 lg:gap-2 lg:grid bg-gray-900 ${
              post.photos.length !== 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"
            }`}
          >
            {post.photos.length === 1 && <div></div>}
            {post.photos.map((photo) => (
              <div key={photo.imageUrl} className="w-full rounded">
                <img
                  src={photo.imageUrl}
                  className="cursor-pointer h-64 object-cover"
                  onClick={() =>
                    dispatch(openFullSizePhotoViewer(photo.imageUrl))
                  }
                  alt="img"
                  width="100%"
                />
              </div>
            ))}
            {post.photos.length === 1 && <div></div>}
          </div>
          {/* <div className="mb-2 overflow-hidden flex flex-row space-x-1">
          {post.photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-gray-900"
              style={{ height: "400px", width: `${100 / post.photos.length}%` }}
            >
              <img
                src={photo.imageUrl}
                className="object-cover cursor-pointer"
                alt="img"
              />
            </div>
          ))}
        </div> */}
          <div className="flex flex-col pl-5 pr-5 pb-5">
            <div className="flex flex-row justify-between pb-2">
              <div className="flex flex-row w-1/12 items-center space-x-1 cursor-pointer ">
                {!!post.likesCount && (
                  <>
                    <StarSolidIcon className="h-5 textPrimary" />
                    <p className="text-xs sm:text-base text-gray-500 dark:text-white">
                      {post.likesCount}
                    </p>
                  </>
                )}
              </div>
              {!!post.commentsCount && (
                <button
                  onClick={() => {
                    if (postId) {
                      dispatch(toggleCommentsVisibility());
                    } else {
                      navigate(`/posts/${post.key}`);
                    }
                  }}
                  className="text-xs sm:text-base text-gray-500 text-right hover:underline cursor-pointer dark:text-neutral-400"
                >
                  {postId ? commentsCount : post.commentsCount} replies
                </button>
              )}
            </div>
            <div className="flex justify-between items-center text-gray-400 border-t border-y-gray-300 pt-1 pb-1 border-b dark:border-y-neutral-600">
              <button
                onClick={() => dispatch(likePostStart(post.id))}
                className={`postActionButtons`}
              >
                {post.likedByCurrentUser ? (
                  <StarSolidIcon className="h-5 textPrimary" />
                ) : (
                  <StarIcon className={`h-5`} />
                )}

                <p
                  className={`text-xs sm:text-base ${
                    post.likedByCurrentUser ? "textPrimary" : ""
                  }`}
                >
                  Like
                </p>
              </button>
              <button
                className="postActionButtons"
                onClick={() => {
                  if (postId) {
                    dispatch(toggleCommentsVisibility());
                  } else {
                    navigate(`/posts/${post.key}`);
                  }
                }}
              >
                <ChatIcon className="h-5" />
                <p className="text-xs sm:text-base">Reply</p>
              </button>
            </div>
            {extras}
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default Post;
