import * as React from "react";
import Box from "@mui/material/Box";
import ListItems from "src/components/listItems";
import Property from "src/components/property/view";
import EditProperty from "src/components/property/editView";

export function PropertyEditList({ data, className, handleRemove, handleEdit }) {
  const [openEditBox, setOpenEditBox] = React.useState(null);

  const handleEditOpen = (index) => {
    setOpenEditBox(index);
  };

  const handleEditClose = () => {
    setOpenEditBox(null);
  };

  const handleEditSave = (editedData) => {
    setOpenEditBox(null);
    handleEdit(editedData);
  };

  return (
    <Box className={className}>
      <ListItems
        data={data}
        itemKey="data"
        component={EditProperty}
        includeDivider={false}
        randomKey={true}
        className="space-y-4"
        handleEditOpen={handleEditOpen}
        handleEditClose={handleEditClose}
        handleEditSave={handleEditSave}
        handleRemove={handleRemove}
        openEditBox={openEditBox}
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
