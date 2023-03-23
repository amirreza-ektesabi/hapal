import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { deletePost, likePost, unlikePost } from "api";
import { getObjFromAction } from "src/_helpers";
import { listsActions } from "./lists";
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

function createInitialState() {
  return adapter.getInitialState({});
}

function createReducers() {
  return {
    addedOne: adapter.addOne,
    addedMany: adapter.addMany,
    removedOne: adapter.removeOne,
    removedOneComment(state, action) {
      const obj = getObjFromAction(state, action);
      if (obj !== null) {
        obj.comments_count -= 1;
      }
    },
  };
}

function extraReducers(builder) {
  builder
    .addCase(extraActions.liked.fulfilled, (state, action) => {
      const obj = getObjFromAction(state, action);
      if (obj !== null) {
        obj.likes_count += 1;
        obj.is_liked = true;
      }
    })
    .addCase(extraActions.unliked.fulfilled, (state, action) => {
      const obj = getObjFromAction(state, action);
      if (obj !== null) {
        obj.likes_count -= 1;
        obj.is_liked = false;
      }
    });
}

function createExtraActions() {
  return {
    retrieved: retrieved(),
    retrievedList: retrievedList(),
    deleted: deleted(),
    liked: liked(),
    unliked: unliked(),
  };

  function retrieved() {
    return createAsyncThunk(`${name}/retrieved`, (data, { dispatch }) => {
      dispatch(postsActions.addedOne(data));
      dispatch(usersActions.addedOne(data.user));
    });
  }

  function retrievedList() {
    return createAsyncThunk(`${name}/retrieved`, (data, { dispatch }) => {
      dispatch(postsActions.addedMany(data));
      const users = data.map((entity) => entity.user);
      dispatch(usersActions.addedMany(users));
    });
  }

  function deleted() {
    return createAsyncThunk(`${name}/deleted`, (data, { dispatch }) =>
      deletePost(data.uuid).then((response) => {
        dispatch(postsActions.removedOne(data.uuid));

        dispatch(listsActions.removedOnePost(data.added_to.uuid));
      })
    );
  }

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
