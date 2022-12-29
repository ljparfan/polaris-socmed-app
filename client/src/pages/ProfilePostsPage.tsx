import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CreatePostSection from "../components/CreatePostSection";
import PostsList from "../components/PostsList";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchPostsByUsernameStart } from "../redux/posts/posts.actions";
import { selectPostsData } from "../redux/posts/posts.selectors";
import { selectIsSelectedProfileCurrentUser } from "../redux/profile/profile.selectors";

type Props = {};

const ProfilePostsPage = (props: Props) => {
  const { username } = useParams();
  const posts = useAppSelector(selectPostsData);
  const dispatch = useAppDispatch();
  const isCurrentUser = useAppSelector(selectIsSelectedProfileCurrentUser);

  useEffect(() => {
    if (username && username !== "me") {
      dispatch(
        fetchPostsByUsernameStart({
          username,
          pageNumber: 1,
          pageSize: 5,
        })
      );
    }
  }, [dispatch, username]);

  return (
    <main className="flex flex-col items-center">
      <div className="w-full md:w-1/2">
        {isCurrentUser && <CreatePostSection />}
        <PostsList
          posts={posts}
          dispatchObj={{
            action: fetchPostsByUsernameStart,
            props: { username, pagination: { pageSize: 5 } },
          }}
        />
      </div>
    </main>
  );
};

export default ProfilePostsPage;
