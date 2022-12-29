import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useRef, useCallback, useEffect } from "react";
import { Post as PostModel } from "../models/post.model";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchPostsStart, resetPostsData } from "../redux/posts/posts.actions";
import {
  selectHasMorePostsToFetch,
  selectPostsCurrentPage,
  selectPostsLoading,
} from "../redux/posts/posts.selectors";
import Post from "./Post";
import Spinner from "./Spinner";

type Props = {
  posts: PostModel[];
  dispatchObj?: { action: ActionCreatorWithPayload<any, any>; props: any };
};

const PostsList = ({
  posts,
  dispatchObj = { props: {}, action: fetchPostsStart },
}: Props) => {
  const postsFetching = useAppSelector(selectPostsLoading);
  const hasMorePostsToFetch = useAppSelector(selectHasMorePostsToFetch);
  const currentPage = useAppSelector(selectPostsCurrentPage);
  const dispatch = useAppDispatch();
  const observer = useRef<any>();

  const lastPostElementRef = useCallback(
    (node) => {
      if (postsFetching) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMorePostsToFetch) {
          dispatch(
            dispatchObj.action({
              pageNumber: currentPage + 1,
              ...dispatchObj.props,
            })
          );
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [postsFetching, hasMorePostsToFetch, dispatch, currentPage, dispatchObj]
  );

  useEffect(() => {
    return () => {
      dispatch(resetPostsData());
    };
  }, [dispatch]);

  if (!postsFetching && posts.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="textDefault font-semibold text-lg my-10">
          No posts to display
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {postsFetching ? (
        <div className="flex items-center justify-center mt-5">
          <Spinner />
        </div>
      ) : (
        posts.map((post, index) =>
          posts.length === index + 1 ? (
            <div ref={lastPostElementRef} key={post.id}>
              <Post post={post} />
            </div>
          ) : (
            <Post key={post.id} post={post} />
          )
        )
      )}
    </div>
  );
};

export default PostsList;
