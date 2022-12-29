import { useParams } from "react-router-dom";
import { Comment as CommentModel } from "../models/comment.model";
import { PaginationResponse } from "../models/pagination-response.model";
import { fetchCommentsStart } from "../redux/comment/comment.actions";
import { selectRemainingCommentsToFetch } from "../redux/comment/comment.selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

type Props = {
  comments: CommentModel[];
  pagination: PaginationResponse;
};

const CommentsList = ({ comments, pagination }: Props) => {
  const remaining = useAppSelector(selectRemainingCommentsToFetch);
  const dispatch = useAppDispatch();
  const { id: postKey } = useParams();
  return (
    <div className="flex flex-col space-y-3">
      {!!remaining && (
        <div>
          <button
            onClick={() =>
              dispatch(
                fetchCommentsStart({
                  postKey: postKey!,
                  pagination: { pageNumber: pagination.page + 1, pageSize: 5 },
                })
              )
            }
            className="text-sm font-semibold text-gray-600 mt-2 hover:underline cursor-pointer"
          >
            View {remaining} previous replies
          </button>
        </div>
      )}
      <ul className="flex flex-col space-y-2 mt-4 items-start max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </ul>
      <CommentForm />
    </div>
  );
};

export default CommentsList;
