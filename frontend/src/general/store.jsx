import { configureStore } from "@reduxjs/toolkit";
import listReducer from "./reducers/lists";
import postsReducer from "./reducers/posts";
import commentsReducer from "./reducers/comments";
import propertiesReducer from "./reducers/properties";
import profileReducer from "./reducers/profile";

const store = configureStore({
  reducer: {
    profile: profileReducer,
    lists: listReducer,
    posts: postsReducer,
    comments: commentsReducer,
    properties: propertiesReducer,
  },
});

export default store;
