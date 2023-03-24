import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import {
  createList,
  deleteList,
  followList,
  likeList,
  unfollowList,
  unlikeList,
  updateList,
} from "api";
import { getObjFromAction } from "src/_helpers";
import { usersActions } from "./users";

const name = "lists";
const adapter = createEntityAdapter({
  selectId: (obj) => obj.uuid,
  sortComparer: (a, b) => b.created.localeCompare(a.created),
});
const initialState = createInitialState();
const extraActions = createExtraActions();
const selectors = createSelectors();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const listsReducer = slice.reducer;
export const listsActions = { ...slice.actions, ...extraActions };
export { selectors as listsSelectors };

function createInitialState() {
  return adapter.getInitialState({});
}

function createReducers() {
  return {
    addedOne: adapter.upsertOne,
    addedMany: adapter.upsertMany,
    removedOne: adapter.removeOne,
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
    removedOnePost(state, action) {
      const obj = getObjFromAction(state, action);
      if (obj !== null) {
        obj.posts_count -= 1;
      }
    },
  };
}

function extraReducers(builder) {
  builder
    .addCase(extraActions.followed.fulfilled, (state, action) => {
      const obj = getObjFromAction(state, action);
      if (obj !== null) {
        obj.followers_count += 1;
        obj.is_followed = true;
      }
    })
    .addCase(extraActions.unfollowed.fulfilled, (state, action) => {
      const obj = getObjFromAction(state, action);
      if (obj !== null) {
        obj.followers_count -= 1;
        obj.is_followed = false;
      }
    })
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
    followed: followed(),
    unfollowed: unfollowed(),
    liked: liked(),
    unliked: unliked(),
  };

  function retrieved() {
    return createAsyncThunk(`${name}/retrieved`, (data, { dispatch }) => {
      dispatch(listsActions.addedOne(data));
      dispatch(usersActions.addedOne(data.user));
    });
  }

  function retrievedList() {
    return createAsyncThunk(`${name}/retrievedList`, (data, { dispatch }) => {
      dispatch(listsActions.addedMany(data));
      const users = data.map((entity) => entity.user);
      dispatch(usersActions.addedMany(users));
    });
  }

  function created() {
    return createAsyncThunk(`${name}/created`, (data, { dispatch }) =>
      createList(data).then((response) => {
        const data = response.data;
        dispatch(listsActions.addedOne(data));
        return data;
      })
    );
  }

  function updated() {
    return createAsyncThunk(`${name}/updated`, (data, { dispatch }) =>
      updateList(data).then((response) => {
        const data = response.data;
        dispatch(listsActions.updateOne({ id: data.uuid, changes: data }));
        return data;
      })
    );
  }

  function deleted() {
    return createAsyncThunk(`${name}/deleted`, (data, { dispatch }) =>
      deleteList(data.uuid).then((response) => {
        dispatch(listsActions.removedOne(data.uuid));

        dispatch(usersActions.removedOneList(data.user.username));
      })
    );
  }

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
