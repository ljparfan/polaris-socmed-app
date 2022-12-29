import { all, call, takeLatest, put, delay } from "redux-saga/effects";
import { Comment } from "../../models/comment.model";
import { Like } from "../../models/like.model";
import { PaginationResponse } from "../../models/pagination-response.model";
import * as commentService from "../../services/comment.service";
import { HttpError } from "../../services/http.service";
import { closeDialog, hideAlert, showAlert } from "../general/general.actions";
import {
  addCommentFailure,
  addCommentStart,
  addCommentSuccess,
  deleteCommentFailure,
  deleteCommentStart,
  deleteCommentSuccess,
  fetchCommentsFailure,
  fetchCommentsStart,
  fetchCommentsSuccess,
  likeCommentFailure,
  likeCommentStart,
  likeCommentSuccess,
} from "./comment.actions";

function* fetchComments({
  payload: { postKey, pagination },
}: ReturnType<typeof fetchCommentsStart>) {
  try {
    const response: { data: Comment[]; pagination: PaginationResponse } =
      yield commentService.fetchComments(postKey, pagination);
    yield put(fetchCommentsSuccess(response));
  } catch (error) {
    yield put(fetchCommentsFailure((error as HttpError).message));
  }
}

function* addComment({
  payload: { commentValue, postKey },
}: ReturnType<typeof addCommentStart>) {
  try {
    const response: Comment = yield commentService.addComment(
      postKey,
      commentValue
    );
    yield put(addCommentSuccess(response));
  } catch (error) {
    yield put(addCommentFailure((error as HttpError).message));
  }
}

function* deleteComment({
  payload: { commentId, postKey },
}: ReturnType<typeof deleteCommentStart>) {
  try {
    const response: Comment = yield commentService.deleteComment(
      postKey,
      commentId
    );
    yield put(deleteCommentSuccess(response));
  } catch (error) {
    yield put(deleteCommentFailure((error as HttpError).message));
  }
}

function* onPossibleDeleteComment({ payload }: ReturnType<typeof closeDialog>) {
  if (payload && payload.type === deleteCommentStart.type) {
    yield put(deleteCommentStart(payload!.payload));
  }
}

function* showDeleteSuccessAndRefresh({
  payload,
}: ReturnType<typeof deleteCommentSuccess>) {
  yield put(
    fetchCommentsStart({
      postKey: payload.post.key,
      pagination: { pageSize: 5, pageNumber: 1 },
    })
  );
  yield put(
    showAlert({ message: "Successfully deleted comment.", type: "success" })
  );
  yield delay(5_000);
  yield put(hideAlert());
}

function* showDeleteFailureMessage({
  payload,
}: ReturnType<typeof deleteCommentFailure>) {
  yield put(showAlert({ message: payload, type: "error" }));
  yield delay(5_000);
  yield put(hideAlert());
}

function* likeComment({
  payload: commentId,
}: ReturnType<typeof likeCommentStart>) {
  try {
    const like: Like = yield commentService.likeComment(commentId);
    yield put(likeCommentSuccess(like));
  } catch (error) {
    yield put(likeCommentFailure((error as HttpError).message));
  }
}

function* onCloseDialog() {
  yield takeLatest(closeDialog.type, onPossibleDeleteComment);
}

function* onFetchCommentsStart() {
  yield takeLatest(fetchCommentsStart.type, fetchComments);
}

function* onAddCommentStart() {
  yield takeLatest(addCommentStart.type, addComment);
}

function* onDeleteCommentStart() {
  yield takeLatest(deleteCommentStart.type, deleteComment);
}

function* onLikeComment() {
  yield takeLatest(likeCommentStart.type, likeComment);
}

function* onDeleteCommentSuccess() {
  yield takeLatest(deleteCommentSuccess.type, showDeleteSuccessAndRefresh);
}

function* onDeleteCommentFailure() {
  yield takeLatest(deleteCommentFailure.type, showDeleteFailureMessage);
}

export function* commentSagas() {
  yield all([
    call(onFetchCommentsStart),
    call(onAddCommentStart),
    call(onDeleteCommentStart),
    call(onCloseDialog),
    call(onLikeComment),
    call(onDeleteCommentSuccess),
    call(onDeleteCommentFailure),
  ]);
}
