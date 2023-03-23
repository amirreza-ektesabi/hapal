import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { deleteComment, likeComment, unlikeComment } from "api";
import { getObjFromAction } from "src/_helpers";
import { listsActions } from "./lists";
import { postsActions } from "./posts";
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

const repliedToActionsMap = {
  list: listsActions,
  post: postsActions,
  comment: commentsActions,
};

function createExtraActions() {
  return {
    retrievedList: retrievedList(),
    deleted: deleted(),
    liked: liked(),
    unliked: unliked(),
  };

  function retrievedList() {
    return createAsyncThunk(`${name}/retrieved`, (data, { dispatch }) => {
      dispatch(commentsActions.addedMany(data));
      const users = data.map((entity) => entity.user);
      dispatch(usersActions.addedMany(users));
    });
  }

  function deleted() {
    return createAsyncThunk(`${name}/deleted`, (data, { dispatch }) =>
      deleteComment(data.uuid).then((response) => {
        dispatch(commentsActions.removedOne(data.uuid));

        const repliedToActions = repliedToActionsMap[data.replied_to.type];
        const removedOneCommentReducer = repliedToActions.removedOneComment;
        dispatch(removedOneCommentReducer(data.replied_to.uuid));
      })
    );
  }

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
