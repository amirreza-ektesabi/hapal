import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { followList, likeList, unfollowList, unlikeList } from "api";

const name = "lists";
const adapter = createEntityAdapter({
  selectId: (obj) => obj.uuid,
  sortComparer: (a, b) => a.created < b.created,
});
const initialState = createInitialState();
const extraActions = createExtraActions();
const selectors = createSelectors();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const listsReducer = slice.reducer;
export const listsActions = { ...slice.actions, ...extraActions };
export { selectors as listsSelectors };

function getObjFromArg(state, action) {
  const response = action.payload;
  const arg = action.meta.arg;
  const obj = !response.error ? state.entities[arg] : null;
  return obj;
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
        obj.followers_count += 1;
        obj.is_followed = true;
      }
    })
    .addCase(extraActions.unfollowed.fulfilled, (state, action) => {
      const obj = getObjFromArg(state, action);
      if (obj !== null) {
        obj.followers_count -= 1;
        obj.is_followed = false;
      }
    })
    .addCase(extraActions.liked.fulfilled, (state, action) => {
      const obj = getObjFromArg(state, action);
      if (obj !== null) {
        obj.likes_count += 1;
        obj.is_liked = true;
      }
    })
    .addCase(extraActions.unliked.fulfilled, (state, action) => {
      const obj = getObjFromArg(state, action);
      if (obj !== null) {
        obj.likes_count -= 1;
        obj.is_liked = false;
      }
    });
}

function createExtraActions() {
  return {
    followed: followed(),
    unfollowed: unfollowed(),
    liked: liked(),
    unliked: unliked(),
  };

  function followed() {
    return createAsyncThunk(
      `${name}/followed`,
      async (uuid) => await followList(uuid)
    );
  }

  function unfollowed() {
    return createAsyncThunk(
      `${name}/unfollowed`,
      async (uuid) => await unfollowList(uuid)
    );
  }

  function liked() {
    return createAsyncThunk(
      `${name}/liked`,
      async (uuid) => await likeList(uuid)
    );
  }

  function unliked() {
    return createAsyncThunk(
      `${name}/unliked`,
      async (uuid) => await unlikeList(uuid)
    );
  }
}

function createSelectors() {
  const { selectAll, selectById: selectByUuid } = adapter.getSelectors(
    (state) => state[name]
  );

  const selectAllUuids = (entities) => entities.map(adapter.selectId);

  const selectUuids = createSelector(selectAll, selectAllUuids);

  const selectByCreatedBy = createSelector(
    [selectAll, (state, createdBy) => createdBy],
    (entities, createdBy) =>
      entities.filter((obj) => obj.user.username == createdBy.username)
  );

  const selectUuidsByCreatedBy = createSelector(
    selectByCreatedBy,
    selectAllUuids
  );

  return {
    selectAll,
    selectByUuid,
    selectUuids,
    selectByCreatedBy,
    selectUuidsByCreatedBy,
  };
}
