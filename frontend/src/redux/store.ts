import { combineReducers, configureStore } from "@reduxjs/toolkit";

import TweetReducer from "./TweetReducer";
import ReplyTweetDataReducer from "./ReplyTweetReducer";
import FollowingTweetDataReducer from "./FollowingTweetReducer";

const combineReducer = combineReducers({
  TweetReducer,
  ReplyTweetDataReducer,
  FollowingTweetDataReducer,
});
export const store = configureStore({ reducer: combineReducer });
