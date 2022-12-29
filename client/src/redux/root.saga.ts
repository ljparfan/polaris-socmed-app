import { all, call } from "redux-saga/effects";
import { authSagas } from "./auth/auth.sagas";
import { commentSagas } from "./comment/comment.sagas";
import { generalSagas } from "./general/general.sagas";
import { postsSagas } from "./posts/posts.sagas";
import { profileSagas } from "./profile/profile.sagas";

export default function* rootSaga() {
  yield all([
    call(authSagas),
    call(postsSagas),
    call(commentSagas),
    call(profileSagas),
    call(generalSagas),
  ]);
}
