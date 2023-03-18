import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { likePost, unlikePost } from "api";
import { usersActions } from "./users";

const name = "posts";
const adapter = createEntityAdapter({
  selectId: (obj) => obj.uuid,
  sortComparer: (a, b) => a.created < b.created,
});
const initialState = createInitialState();
const extraActions = createExtraActions();
const selectors = createSelectors();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const postsReducer = slice.reducer;
export const postsActions = { ...slice.actions, ...extraActions };
export { selectors as postsSelectors };

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
    liked: liked(),
    unliked: unliked(),
  };

  function liked() {
    return createAsyncThunk(
      `${name}/liked`,
      async (uuid) => await likePost(uuid)
    );
  }

  function unliked() {
    return createAsyncThunk(
      `${name}/unliked`,
      async (uuid) => await unlikePost(uuid)
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

  const selectByAddedTo = createSelector(
    [selectAll, (state, addedTo) => addedTo],
    (entities, addedTo) =>
      entities.filter(
        (obj) =>
          obj.added_to.uuid == addedTo.uuid && obj.added_to.type == addedTo.type
      )
  );

  const selectUuidsByAddedTo = createSelector(selectByAddedTo, selectAllUuids);

  return {
    selectAll,
    selectByUuid,
    selectUuids,
    selectByCreatedBy,
    selectUuidsByCreatedBy,
    selectByAddedTo,
    selectUuidsByAddedTo,
  };
}
