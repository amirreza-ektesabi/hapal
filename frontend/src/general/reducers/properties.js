import {
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import property_items from "../../../public/sample_data/property_items";

const propertiesAdapter = createEntityAdapter({
  selectId: (obj) => obj.puuid,
});

const propertiesSlice = createSlice({
  name: "properties",
  initialState: propertiesAdapter.addMany(
    propertiesAdapter.getInitialState({}),
    property_items
  ),
  reducers: {},
});

export default propertiesSlice.reducer;

export const { propertyLiked } = propertiesSlice.actions;

export const {
  selectAll: selectProperties,
  selectById: selectPropertyByPuuid,
} = propertiesAdapter.getSelectors((state) => state.properties);

export const selectPropertyPuuids = createSelector(
  selectProperties,
  (entities) => entities.map((obj) => obj.puuid)
);
