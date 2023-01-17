import {
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import list_items from "../../../public/sample_data/list_items";

const listsAdapter = createEntityAdapter({
  selectId: (obj) => obj.uuid,
  sortComparer: (a, b) => a.created.localeCompare(b.created),
});

const listsSlice = createSlice({
  name: "lists",
  initialState: listsAdapter.addMany(
    listsAdapter.getInitialState({}),
    list_items
  ),
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
  },
});

export default listsSlice.reducer;

export const {
  liked: listLiked,
  followed: listFollowed,
  userFollowed: listUserFollowed,
} = listsSlice.actions;

export const { selectAll: selectLists, selectById: selectListByUuid } =
  listsAdapter.getSelectors((state) => state.lists);

export const selectListUuids = createSelector(selectLists, (entities) =>
  entities.map((obj) => obj.uuid)
);
