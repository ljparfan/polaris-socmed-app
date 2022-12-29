import { CameraIcon } from "@heroicons/react/solid";
import { ChangeEvent, useState } from "react";
import useInput from "../hooks/useInput";
import { Post } from "../models/post.model";
import { selectCurrentUser } from "../redux/auth/auth.selectors";
import { hideAlert, showAlert } from "../redux/general/general.actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addPostStart } from "../redux/posts/posts.actions";
import { selectAddPostLoading } from "../redux/posts/posts.selectors";
import Button from "./Button";
import PreviewPhotos from "./PreviewPhotos";

const CreatePostSection = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const addPostLoading = useAppSelector(selectAddPostLoading);
  const dispatch = useAppDispatch();
  const [post, onChange, clearValue] = useInput();
  const [photos, setPhotos] = useState<File[]>();

  const isInvalid = () => {
    return !post.trim();
  };

  const handleFilesChange = ({
    target: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!files || files.length === 0) {
      return;
    }

    const photos = Array.from(files);

    if (photos.length > 3) {
      dispatch(
        showAlert({
          type: "error",
          message: "You are only allowed to upload a maximum of 3 photos.",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 5_000);
      return;
    }

    setPhotos(photos);
  };

  return (
    <form
      className="card p-2 font-medium mt-6"
      onSubmit={(e) => {
        e.preventDefault();
        const postToCreate = { value: post } as Post;
        if (photos && photos.length > 0) {
          postToCreate.photoFiles = photos;
        }
        dispatch(addPostStart(postToCreate));
        clearValue();
        setPhotos([]);
      }}
    >
      <div className="flex space-x-4 p-4 items-center">
        <div className="flex flex-1">
          <textarea
            value={post}
            onChange={onChange}
            id="post"
            name="post"
            rows={4}
            cols={4}
            className="resize-none rounded-3xl h-20 p-5 textInput flex-grow px-5 focus:outline-none"
            placeholder={`What's on your mind, ${currentUser?.name}?`}
          />
        </div>
      </div>
      {photos && photos.length > 0 && (
        <div className="p-4">
          <PreviewPhotos
            photos={photos}
            onRemove={(fileName) => {
              setPhotos(photos.filter((photo) => photo.name !== fileName));
            }}
          />
        </div>
      )}
      <div className="flex flex-row justify-between pl-4 pr-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          multiple
          id="add-photo"
          onChange={handleFilesChange}
        />
        <label className="inputIcon" htmlFor="add-photo">
          <CameraIcon className="h-6 textPrimary" />
          <p className="text-xs sm:text-sm xl:text-sm dark:text-neutral-300">
            Photo
          </p>
        </label>

        <Button
          type="submit"
          className={`shadow rounded-2xl w-4/12 md:w-2/12 font-bold ${
            isInvalid() ? "bgPrimaryDisabled" : "bgPrimary"
          }`}
          disabled={isInvalid()}
          loading={addPostLoading}
        >
          Post
        </Button>
      </div>
    </form>
  );
};

export default CreatePostSection;
