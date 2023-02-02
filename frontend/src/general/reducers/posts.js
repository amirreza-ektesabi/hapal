import {
    createSlice,
    createSelector,
    createEntityAdapter,
} from "@reduxjs/toolkit";
import post_items from "public/sample_data/post_items";

const postsAdapter = createEntityAdapter({
    selectId: (obj) => obj.uuid,
    sortComparer: (a, b) => a.created.localeCompare(b.created),
});

const postsSlice = createSlice({
    name: "posts",
    initialState: postsAdapter.addMany(
        postsAdapter.getInitialState({}),
        post_items
    ),
    reducers: {
        liked(state, action) {
            const uuid = action.payload;
            const obj = state.entities[uuid];
            obj.likes_count += obj.is_liked ? -1 : +1;
            obj.is_liked = !obj.is_liked;
        },
        userFollowed(state, action) {
            const uuid = action.payload;
            const obj = state.entities[uuid];
            obj.user.is_followed = !obj.user.is_followed;
        },
    },
});

export default postsSlice.reducer;

export const { liked: postLiked, userFollowed: postUserFollowed } =
postsSlice.actions;

export const { selectAll: selectPosts, selectById: selectPostByUuid } =
postsAdapter.getSelectors((state) => state.posts);

export const selectPostUuids = createSelector(selectPosts, (entities) =>
    entities.map((obj) => obj.uuid)
);