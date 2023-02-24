import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth";
import { usersReducer } from "./users";
import { listsReducer } from "./lists";
import { postsReducer } from "./posts";
import { commentsReducer } from "./comments";
import { propertiesReducer } from "./properties";

export * from "./auth";
export * from "./lists";
export * from "./posts";
export * from "./comments";
export * from "./properties";
export * from "./users";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    lists: listsReducer,
    posts: postsReducer,
    comments: commentsReducer,
    properties: propertiesReducer,
  },
});

export default store;
