import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommentsList from "../components/CommentsList";
import FullPageSpinner from "../components/FullPageSpinner";
import Post from "../components/Post";
import { fetchCommentsStart } from "../redux/comment/comment.actions";
import {
  selectComments,
  selectCommentsVisibility,
} from "../redux/comment/comment.selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSelectedPostStart } from "../redux/posts/posts.actions";
import {
  selectFetchSelectedPostLoading,
  selectSelectedPost,
} from "../redux/posts/posts.selectors";

type Props = {};

const PostPage = (props: Props) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectFetchSelectedPostLoading);
  const post = useAppSelector(selectSelectedPost);
  const { pagination, data: comments } = useAppSelector(selectComments);
  const showComments = useAppSelector(selectCommentsVisibility);

  useEffect(() => {
    dispatch(fetchSelectedPostStart(id!));
    dispatch(
      fetchCommentsStart({
        postKey: id!,
        pagination: { pageNumber: 1, pageSize: 5 },
      })
    );
  }, [dispatch, id]);

  const render = useCallback(() => {
    if (loading) {
      return <FullPageSpinner />;
    }

    if (!post) {
      return <div className="textDefault">Post not found</div>;
    }

    return (
      <Post
        post={post}
        extras={
          showComments && (
            <CommentsList comments={comments} pagination={pagination} />
          )
        }
      />
    );
  }, [post, loading, comments, pagination, showComments]);

  return (
    <main className="flex flex-col items-center p-2">
      <div className="w-full lg:w-1/3">{render()}</div>
    </main>
  );
};

export default PostPage;
