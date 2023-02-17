import {
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";

const postsAdapter = createEntityAdapter({
  selectId: (obj) => obj.uuid,
  sortComparer: (a, b) => a.created.localeCompare(b.created),
});

const postsSlice = createSlice({
  name: "posts",
  initialState: postsAdapter.getInitialState({}),
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
    addedOne: postsAdapter.addOne,
    addedMany: postsAdapter.addMany,
  },
});

export default postsSlice.reducer;

export const {
  liked: postLiked,
  userFollowed: postUserFollowed,
  addedOne: addedOnePost,
  addedMany: addedManyPosts,
} = postsSlice.actions;

export const { selectAll: selectPosts, selectById: selectPostByUuid } =
  postsAdapter.getSelectors((state) => state.posts);

const selectUuids = (entities) => entities.map((obj) => obj.uuid);

export const selectPostUuids = createSelector(selectPosts, selectUuids);

export const selectPostsByAddedTo = createSelector(
  [selectPosts, (state, addedTo) => addedTo],
  (entities, addedTo) =>
    entities.filter(
      (obj) =>
        obj.added_to.uuid == addedTo.uuid && obj.added_to.type == addedTo.type
    )
);

export const selectPostUuidsByAddedTo = createSelector(
  selectPostsByAddedTo,
  selectUuids
);
