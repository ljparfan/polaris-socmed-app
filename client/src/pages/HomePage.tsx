import { useEffect } from "react";
import CreatePostSection from "../components/CreatePostSection";
import PostsList from "../components/PostsList";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchPostsStart } from "../redux/posts/posts.actions";
import { selectPostsData } from "../redux/posts/posts.selectors";

type Props = {};

const HomePage = (props: Props) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPostsData);

  useEffect(() => {
    dispatch(fetchPostsStart({ pageNumber: 1, pageSize: 5 }));
  }, [dispatch]);

  return (
    <main className="flex flex-col items-center p-2">
      <div className="w-full md:w-1/3">
        <CreatePostSection />
        <PostsList posts={posts} />
      </div>
    </main>
  );
};

export default HomePage;
