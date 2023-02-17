import {
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";

const propertiesAdapter = createEntityAdapter({
  selectId: (obj) => obj.puuid,
});

const propertiesSlice = createSlice({
  name: "properties",
  initialState: propertiesAdapter.getInitialState({}),
  reducers: {
    addedOne: propertiesAdapter.addOne,
    addedMany: propertiesAdapter.addMany,
  },
});

export default propertiesSlice.reducer;

export const { addedOne: addedOneProperty, addedMany: addedManyProperties } =
  propertiesSlice.actions;

export const {
  selectAll: selectProperties,
  selectById: selectPropertyByPuuid,
} = propertiesAdapter.getSelectors((state) => state.properties);

const selectPuuids = (entities) => entities.map((obj) => obj.puuid);

export const selectPropertyPuuids = createSelector(
  selectProperties,
  selectPuuids
);

export const selectPropertiesByPostUuid = createSelector(
  [selectProperties, (state, post) => post],
  (entities, post) => entities.filter((obj) => obj.post.uuid == post.uuid)
);

export const selectpropertyPuuidsByPostUuid = createSelector(
  selectPropertiesByPostUuid,
  selectPuuids
);
