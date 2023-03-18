import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { followUser, unfollowUser } from "api";

const name = "users";
const adapter = createEntityAdapter({
  selectId: (obj) => obj.username,
  sortComparer: (a, b) => a.username.localeCompare(b.username),
});
const initialState = createInitialState();
const extraActions = createExtraActions();
const selectors = createSelectors();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const usersReducer = slice.reducer;
export const usersActions = { ...slice.actions, ...extraActions };
export { selectors as usersSelectors };

function getObjFromArg(state, action) {
  const response = action.payload;
  const arg = action.meta.arg;
  return !response.error ? state.entities[arg] : null;
}

function createInitialState() {
  return adapter.getInitialState({});
}

function createReducers() {
  return {
    addedOne: adapter.addOne,
    addedMany: adapter.addMany,
  };
}

function extraReducers(builder) {
  builder
    .addCase(extraActions.followed.fulfilled, (state, action) => {
      const obj = getObjFromArg(state, action);
      if (obj !== null) {
        if (obj.followers_count !== undefined) obj.followers_count += 1;
        obj.is_followed = true;
      }
    })
    .addCase(extraActions.unfollowed.fulfilled, (state, action) => {
      const obj = getObjFromArg(state, action);
      if (obj !== null) {
        if (obj.followers_count !== undefined) obj.followers_count -= 1;
        obj.is_followed = false;
      }
    });
}

function createExtraActions() {
  return {
    followed: followed(),
    unfollowed: unfollowed(),
  };

  function followed() {
    return createAsyncThunk(
      `${name}/followed`,
      async (username) => await followUser(username)
    );
  }

  function unfollowed() {
    return createAsyncThunk(
      `${name}/unfollowed`,
      async (username) => await unfollowUser(username)
    );
  }
}

function createSelectors() {
  const { selectAll, selectById: selectByUsername } = adapter.getSelectors(
    (state) => state[name]
  );

  const selectAllUsernames = createSelector(selectAll, (entities) =>
    entities.map(adapter.selectId)
  );

  return {
    selectAll,
    selectByUsername,
    selectAllUsernames,
  };
}
