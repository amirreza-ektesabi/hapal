import {
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";

const listsAdapter = createEntityAdapter({
  selectId: (obj) => obj.uuid,
  sortComparer: (a, b) => a.created.localeCompare(b.created),
});

const listsSlice = createSlice({
  name: "lists",
  initialState: listsAdapter.getInitialState({}),
  reducers: {
    liked(state, action) {
      const uuid = action.payload;
      const obj = state.entities[uuid];
      obj.likes_count += obj.is_liked ? -1 : +1;
      obj.is_liked = !obj.is_liked;
    },
    followed(state, action) {
      const uuid = action.payload;
      const obj = state.entities[uuid];
      obj.followers_count += obj.is_followed ? -1 : +1;
      obj.is_followed = !obj.is_followed;
    },
    userFollowed(state, action) {
      const uuid = action.payload;
      const obj = state.entities[uuid];
      obj.user.is_followed = !obj.user.is_followed;
    },
    addedOne: listsAdapter.addOne,
    addedMany: listsAdapter.addMany,
  },
});

export const listsReducer = listsSlice.reducer;

export const {
  liked: listLiked,
  followed: listFollowed,
  userFollowed: listUserFollowed,
  addedOne: addedOneList,
  addedMany: addedManyLists,
} = listsSlice.actions;

export const { selectAll: selectLists, selectById: selectListByUuid } =
  listsAdapter.getSelectors((state) => state.lists);

const selectUuids = (entities) => entities.map((obj) => obj.uuid);

export const selectListUuids = createSelector(selectLists, selectUuids);

export const selectListsByCreatedBy = createSelector(
  [selectLists, (state, createdBy) => createdBy],
  (entities, createdBy) =>
    entities.filter((obj) => obj.user.username == createdBy.username)
);

export const selectListUuidsByCreatedBy = createSelector(
  selectListsByCreatedBy,
  selectUuids
);
