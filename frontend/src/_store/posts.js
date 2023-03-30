import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { createPost, deletePost, likePost, unlikePost, updatePost } from "api";
import { getObjFromAction } from "src/_helpers";
import { listsActions } from "./lists";
import { usersActions } from "./users";

const name = "posts";
const adapter = createEntityAdapter({
  selectId: (obj) => obj.uuid,
  sortComparer: (a, b) => b.created.localeCompare(a.created),
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
    addedOne: adapter.upsertOne,
    addedMany: adapter.upsertMany,
    removedOne: adapter.removeOne,
    removedMany: adapter.removeMany,
    updateOne: adapter.updateOne,
    removedOneComment(state, action) {
      const obj = getObjFromAction(state, action);
      if (obj !== null) {
        obj.comments_count -= 1;
      }
    },
    addedOneComment(state, action) {
      const obj = getObjFromAction(state, action);
      if (obj !== null) {
        obj.comments_count += 1;
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
    created: created(),
    updated: updated(),
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

  function removedAbsents(dispatch, state, data) {
    const oldEntities = state.entities;
    const oldUuids = new Set();
    for (const [uuid, obj] of Object.entries(oldEntities))
      if (obj.added_to.uuid == data.addedToUuid) oldUuids.add(uuid);
    const newUuids = new Set(data.list.map((obj) => obj.uuid));
    const deletedUuids = new Set(
      [...oldUuids].filter((obj) => !newUuids.has(obj))
    );
    dispatch(postsActions.removedMany(deletedUuids));
  }

  function retrievedList() {
    return createAsyncThunk(
      `${name}/retrievedList`,
      (data, { dispatch, getState }) => {
        removedAbsents(dispatch, getState()[name], data);
        dispatch(postsActions.addedMany(data.list));
        const users = data.list.map((entity) => entity.user);
        dispatch(usersActions.addedMany(users));
      }
    );
  }

  function created() {
    return createAsyncThunk(`${name}/created`, (data, { dispatch }) =>
      createPost(data).then((response) => {
        const responseData = response.data;
        dispatch(postsActions.addedOne(responseData));
        return responseData;
      })
    );
  }

  function updated() {
    return createAsyncThunk(`${name}/updated`, (data, { dispatch }) =>
      updatePost(data).then((response) => {
        const responseData = response.data;
        dispatch(
          postsActions.updateOne({
            id: responseData.uuid,
            changes: responseData,
          })
        );
        return responseData;
      })
    );
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
