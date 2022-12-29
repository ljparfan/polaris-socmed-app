import { StarIcon, TrashIcon } from "@heroicons/react/solid";
import { Link, useParams } from "react-router-dom";
import { Comment as CommentModel } from "../models/comment.model";
import {
  deleteCommentStart,
  likeCommentStart,
} from "../redux/comment/comment.actions";
import { openDialog } from "../redux/general/general.actions";
import { useAppDispatch } from "../redux/hooks";
import Avatar from "./Avatar";
import FormattedDate from "./FormattedDate";

type Props = {
  comment: CommentModel;
};

const Comment = ({ comment }: Props) => {
  const dispatch = useAppDispatch();
  const { id: postKey } = useParams();
  return (
    <li className="flex">
      <Link to={`/${comment.user.username}`}>
        <Avatar user={comment.user} className="cursor-pointer" />
      </Link>
      <div className="flex flex-col">
        <div className="flex flex-row justify-start items-center space-x-2">
          <div className="flex flex-row items-end">
            <div className="flex flex-col bg-gray-100 dark:bg-neutral-600 rounded-2xl pt-2 pb-2 pl-4 pr-4">
              <Link to={`/users/${comment.user.username}`}>
                <p className="font-bold text-xs hover:underline">
                  {comment.user.name}
                </p>
              </Link>
              <p className="text-sm">{comment.value}</p>
            </div>
            {comment.likesCount > 0 && (
              <button className="flex flex-row items-center">
                <StarIcon className="h-4 textPrimary" />
                {comment.likesCount > 1 && (
                  <span className="text-xs sm:text-base text-gray-500">
                    {comment.likesCount}
                  </span>
                )}
              </button>
            )}
          </div>
          <button
            type="button"
            className="p-1 rounded-full text-white opacity-0 hover:bg-gray-200 dark:hover:bg-neutral-600 hover:opacity-100"
            onClick={() => {
              dispatch(
                openDialog({
                  title: "Delete Comment",
                  body: "Are you sure you want to delete your comment? This comment will be permanently removed. This action cannot be undone.",
                  visible: true,
                  actionButton: {
                    text: "Delete",
                    type: "error",
                  },
                  actionToBeFired: deleteCommentStart({
                    postKey: postKey!,
                    commentId: comment.id,
                  }),
                })
              );
            }}
          >
            <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-row pl-1 space-x-4 text-sm items-center">
          <button
            onClick={() => dispatch(likeCommentStart(comment.id))}
            className={`font-semibold hover:underline cursor-pointer ${
              comment.likedByCurrentUser
                ? "textPrimary"
                : "text-gray-600 dark:text-neutral-400 "
            }`}
          >
            Like
          </button>
          <FormattedDate value={comment.createdAt} />
        </div>
      </div>
    </li>
  );
};

export default Comment;
