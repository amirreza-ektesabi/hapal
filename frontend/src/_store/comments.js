import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { likeComment, unlikeComment } from "api";
import { usersActions } from "./users";

const name = "comments";
const adapter = createEntityAdapter({
  selectId: (obj) => obj.uuid,
  sortComparer: (a, b) => a.created < b.created,
});
const initialState = createInitialState();
const extraActions = createExtraActions();
const selectors = createSelectors();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const commentsReducer = slice.reducer;
export const commentsActions = { ...slice.actions, ...extraActions };
export { selectors as commentsSelectors };

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
      async (uuid) => await likeComment(uuid)
    );
  }

  function unliked() {
    return createAsyncThunk(
      `${name}/unliked`,
      async (uuid) => await unlikeComment(uuid)
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

  const selectByRepliedTo = createSelector(
    [selectAll, (state, repliedTo) => repliedTo],
    (entities, repliedTo) =>
      entities.filter(
        (obj) =>
          obj.replied_to.uuid == repliedTo.uuid &&
          obj.replied_to.type == repliedTo.type
      )
  );

  const selectUuidsByRepliedTo = createSelector(
    selectByRepliedTo,
    selectAllUuids
  );

  return {
    selectAll,
    selectByUuid,
    selectUuids,
    selectByCreatedBy,
    selectUuidsByCreatedBy,
    selectByRepliedTo,
    selectUuidsByRepliedTo,
  };
}
