import { all, call, takeLatest, put, delay } from "redux-saga/effects";
import * as postService from "../../services/post.service";
import { HttpError } from "../../services/http.service";
import {
  addPostFailure,
  addPostStart,
  addPostSuccess,
  deletePostFailure,
  deletePostStart,
  deletePostSuccess,
  fetchPostsByUsernameStart,
  fetchPostsFailure,
  fetchPostsStart,
  fetchPostsSuccess,
  fetchSelectedPostFailure,
  fetchSelectedPostStart,
  fetchSelectedPostSuccess,
  likePostFailure,
  likePostStart,
  likePostSuccess,
} from "./posts.actions";
import { Post } from "../../models/post.model";
import { closeDialog, hideAlert, showAlert } from "../general/general.actions";
import { PaginationResponse } from "../../models/pagination-response.model";
import { Like } from "../../models/like.model";

function* fetchPosts({
  payload: pagination,
}: ReturnType<typeof fetchPostsStart>) {
  try {
    const response: { data: Post[]; pagination: PaginationResponse } =
      yield postService.fetchPosts(pagination);
    yield put(fetchPostsSuccess(response));
  } catch (error) {
    yield put(fetchPostsFailure((error as HttpError).message));
  }
}

function* fetchPostsByUsername({
  payload: { username, pageNumber, pageSize },
}: ReturnType<typeof fetchPostsByUsernameStart>) {
  try {
    const response: { data: Post[]; pagination: PaginationResponse } =
      yield postService.fetchPostsByUsername(username, {
        pageNumber,
        pageSize,
      });
    yield put(fetchPostsSuccess(response));
  } catch (error) {
    yield put(fetchPostsFailure((error as HttpError).message));
  }
}

function* addPost({ payload: post }: ReturnType<typeof addPostStart>) {
  try {
    const addedPost: Post = yield postService.addPost(post);
    yield put(addPostSuccess(addedPost));
    yield put(
      showAlert({ type: "success", message: "Post successfully added." })
    );
    yield delay(5_000);
    yield put(hideAlert());
  } catch (error) {
    yield put(addPostFailure((error as HttpError).message));
    yield put(
      showAlert({ type: "error", message: (error as HttpError).message })
    );
    yield delay(5_000);
    yield put(hideAlert());
  }
}

function* deletePost({ payload: id }: ReturnType<typeof deletePostStart>) {
  try {
    const deletedPost: Post = yield postService.deletePost(id);
    yield put(deletePostSuccess(deletedPost));
  } catch (error) {
    yield put(deletePostFailure((error as HttpError).message));
  }
}

function* likePost({ payload: postId }: ReturnType<typeof likePostStart>) {
  try {
    const like: Like = yield postService.likePost(postId);
    yield put(likePostSuccess(like));
  } catch (error) {
    yield put(likePostFailure((error as HttpError).message));
  }
}

function* fetchSelectedPost({
  payload: key,
}: ReturnType<typeof fetchSelectedPostStart>) {
  try {
    const post: Post = yield postService.fetchPost(key);
    yield put(fetchSelectedPostSuccess(post));
  } catch (error) {
    yield put(fetchSelectedPostFailure((error as HttpError).message));
  }
}

function* showDeleteSuccessMessage() {
  yield put(
    showAlert({ message: "Successfully deleted post.", type: "success" })
  );
  yield delay(5_000);
  yield put(hideAlert());
}

function* showDeleteFailureMessage({
  payload,
}: ReturnType<typeof deletePostFailure>) {
  yield put(showAlert({ message: payload, type: "error" }));
  yield delay(5_000);
  yield put(hideAlert());
}

function* onFetchPostsStart() {
  yield takeLatest(fetchPostsStart.type, fetchPosts);
}

function* onFetchPostsByUsernameStart() {
  yield takeLatest(fetchPostsByUsernameStart.type, fetchPostsByUsername);
}

function* onAddPostStart() {
  yield takeLatest(addPostStart.type, addPost);
}

function* onFetchSelectedPostStart() {
  yield takeLatest(fetchSelectedPostStart.type, fetchSelectedPost);
}

function* onPossibleDeletePost({ payload }: ReturnType<typeof closeDialog>) {
  if (payload && payload.type === deletePostStart.type) {
    yield put(deletePostStart(payload!.payload));
  }
}

function* onCloseDialog() {
  yield takeLatest(closeDialog.type, onPossibleDeletePost);
}

function* onDeletePostStart() {
  yield takeLatest(deletePostStart.type, deletePost);
}

function* onDeletePostSuccess() {
  yield takeLatest(deletePostSuccess.type, showDeleteSuccessMessage);
}

function* onDeletePostFailure() {
  yield takeLatest(deletePostFailure.type, showDeleteFailureMessage);
}

function* onLikePost() {
  yield takeLatest(likePostStart.type, likePost);
}

export function* postsSagas() {
  yield all([
    call(onFetchPostsStart),
    call(onAddPostStart),
    call(onDeletePostStart),
    call(onDeletePostSuccess),
    call(onDeletePostFailure),
    call(onLikePost),
    call(onFetchSelectedPostStart),
    call(onCloseDialog),
    call(onFetchPostsByUsernameStart),
  ]);
}
