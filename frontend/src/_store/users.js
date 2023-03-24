import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { followUser, unfollowUser } from "api";
import { getObjFromAction } from "src/_helpers";

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

function createInitialState() {
  return adapter.getInitialState({});
}

function createReducers() {
  return {
    addedOne: adapter.upsertOne,
    addedMany: adapter.upsertMany,
    removedOneList(state, action) {
      const obj = getObjFromAction(state, action);
      if (obj !== null) {
        obj.lists_count -= 1;
      }
    },
  };
}

function extraReducers(builder) {
  builder
    .addCase(extraActions.followed.fulfilled, (state, action) => {
      const obj = getObjFromAction(state, action);
      if (obj !== null) {
        if (obj.followers_count !== undefined) obj.followers_count += 1;
        obj.is_followed = true;
      }
    })
    .addCase(extraActions.unfollowed.fulfilled, (state, action) => {
      const obj = getObjFromAction(state, action);
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
