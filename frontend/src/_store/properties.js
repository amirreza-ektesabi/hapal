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
  };
}

function extraReducers(builder) {}

function createExtraActions() {
  return {};
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
