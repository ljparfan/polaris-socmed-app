import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.reducer";
import commentReducer from "./comment/comment.reducer";
import generalReducer from "./general/general.reducer";
import postsReducer from "./posts/posts.reducer";
import profileReducer from "./profile/profile.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  comment: commentReducer,
  general: generalReducer,
  profile: profileReducer,
});

export default rootReducer;
