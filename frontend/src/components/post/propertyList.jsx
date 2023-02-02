import * as React from "react";
import Box from "@mui/material/Box";
import ListItems from "src/components/listItems";
import Property, { EditProperty } from "src/components/property/view";

export function PropertyEditList({ data, className, puuids = [] }) {
  const [openEditPropertyBox, setOpenEditPropertyBox] = React.useState(null);

  const handleEditOpen = (puuid) => {
    setOpenEditPropertyBox(puuid);
  };

  const handleEditClose = () => {
    setOpenEditPropertyBox(null);
  };

  return (
    <Box className={className}>
      <ListItems
        data={puuids}
        itemKey="puuid"
        component={EditProperty}
        includeDivider={false}
        className="space-y-4"
        handleEditOpen={handleEditOpen}
        handleEditClose={handleEditClose}
        openEditPropertyBox={openEditPropertyBox}
      />
    </Box>
  );
}

export function PropertyList({ data, className, puuis = [] }) {
  return (
    <Box className={className}>
      <ListItems
        data={puuis}
        itemKey="puuid"
        component={Property}
        includeDivider={false}
        className="space-y-4"
      />
    </Box>
  );
}
