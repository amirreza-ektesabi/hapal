import { configureStore } from "@reduxjs/toolkit";
import listReducer from "src/general/reducers/lists";
import postsReducer from "src/general/reducers/posts";
import commentsReducer from "src/general/reducers/comments";
import propertiesReducer from "src/general/reducers/properties";
import usersReducer from "src/general/reducers/users";

const store = configureStore({
  reducer: {
    users: usersReducer,
    lists: listReducer,
    posts: postsReducer,
    comments: commentsReducer,
    properties: propertiesReducer,
  },
});

export default store;
