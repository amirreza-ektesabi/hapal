import { configureStore } from "@reduxjs/toolkit";
import { listsReducer } from "./lists";
import { postsReducer } from "./posts";
import { commentsReducer } from "./comments";
import { propertiesReducer } from "./properties";
import { usersReducer } from "./users";

export * from "./lists";
export * from "./posts";
export * from "./comments";
export * from "./properties";
export * from "./users";

const store = configureStore({
    reducer: {
        users: usersReducer,
        lists: listsReducer,
        posts: postsReducer,
        comments: commentsReducer,
        properties: propertiesReducer,
    },
});

export default store;