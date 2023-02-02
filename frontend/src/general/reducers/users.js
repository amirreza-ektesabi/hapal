import {
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import user_items from "public/sample_data/user_items";

const usersAdapter = createEntityAdapter({
  selectId: (obj) => obj.username,
  sortComparer: (a, b) => a.username.localeCompare(b.username),
});

const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.addMany(
    usersAdapter.getInitialState({}),
    user_items
  ),
  reducers: {
    followed(state, action) {
      const username = action.payload;
      const obj = state.entities[username];
      obj.followers_count += obj.is_followed ? -1 : +1;
      obj.is_followed = !obj.is_followed;
    },
  },
});

export default usersSlice.reducer;

export const { followed: userFollowed } = usersSlice.actions;

const { selectAll: selectAllUsers, selectById: selectUserByUsername } =
  usersAdapter.getSelectors((state) => state.users);

export { selectUserByUsername };

export const selectUserUsernames = createSelector(selectAllUsers, (entities) =>
  entities.map((obj) => obj.username)
);
