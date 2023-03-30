import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

const name = "properties";
const adapter = createEntityAdapter({
  selectId: (obj) => obj.puuid,
  sortComparer: (a, b) => a.order < b.order,
});
const initialState = createInitialState();
const extraActions = createExtraActions();
const selectors = createSelectors();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const propertiesReducer = slice.reducer;
export const propertiesActions = { ...slice.actions, ...extraActions };
export { selectors as propertiesSelectors };

function createInitialState() {
  return adapter.getInitialState({});
}

function createReducers() {
  return {
    addedOne: adapter.upsertOne,
    addedMany: adapter.upsertMany,
    removedMany: adapter.removeMany,
  };
}

function extraReducers(builder) {}

function createExtraActions() {
  return {
    retrievedList: retrievedList(),
  };

  function removedOld(dispatch, state, data) {
    const oldEntities = state.entities;
    const oldPuuids = [];
    for (const [puuid, obj] of Object.entries(oldEntities))
      if (obj.post.uuid == data.postUuid) oldPuuids.push(puuid);
    dispatch(propertiesActions.removedMany(oldPuuids));
  }

  function retrievedList() {
    return createAsyncThunk(
      `${name}/retrievedList`,
      (data, { dispatch, getState }) => {
        removedOld(dispatch, getState()[name], data);
        dispatch(propertiesActions.addedMany(data.list));
      }
    );
  }
}

function createSelectors() {
  const { selectAll, selectById: selectByPuuid } = adapter.getSelectors(
    (state) => state[name]
  );

  const selectAllPuuids = (entities) => entities.map(adapter.selectId);

  const selectPuuids = createSelector(selectAll, selectAllPuuids);

  const selectByPostUuid = createSelector(
    [selectAll, (state, postUuid) => postUuid],
    (entities, postUuid) => entities.filter((obj) => obj.post.uuid == postUuid)
  );

  const selectPuuidsByPostUuid = createSelector(
    selectByPostUuid,
    selectAllPuuids
  );

  return {
    selectAll,
    selectByPuuid,
    selectPuuids,
    selectByPostUuid,
    selectPuuidsByPostUuid,
  };
}
