import { useParams } from "react-router-dom";
import useInput from "../hooks/useInput";
import { addCommentStart } from "../redux/comment/comment.actions";
import { useAppDispatch } from "../redux/hooks";

const CommentForm = () => {
  const [comment, onCommentChange, clearComment] = useInput("");
  const { id: postKey } = useParams();
  const dispatch = useAppDispatch();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(
          addCommentStart({
            commentValue: comment,
            postKey: postKey!,
          })
        );
        clearComment();
      }}
      className="flex items-center rounded-full bg-gray-100 p-2 dark:bg-neutral-700"
    >
      <input
        value={comment}
        onChange={onCommentChange}
        autoFocus
        className="w-full md:inline-flex ml-2 items-center outline-none flex-shrink textInput"
        type="text"
        placeholder="Write a reply..."
      />
      <button type="submit" className="invisible"></button>
    </form>
  );
};

export default CommentForm;
