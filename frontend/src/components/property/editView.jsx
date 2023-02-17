import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ListItems from "src/components/listItems";
import EditPropertyBox from "src/components/property/editBox";
import Pair from "src/components/pair/view";

function Icons({
  data,
  openEditBox,
  handleEditClose,
  handleEditOpen,
  handleEditSave,
  handleRemove,
}) {
  return (
    <Box className="mb-1 space-x-1">
      <EditRoundedIcon
        className="text-xl cursor-pointer hover:fill-greyZ"
        onClick={() => handleEditOpen(data.index)}
      />
      <DeleteRoundedIcon
        className="text-xl cursor-pointer hover:text-greyZ"
        onClick={() => handleRemove(data.index)}
      />
      <EditPropertyBox
        data={data}
        open={openEditBox === data.index}
        handleClose={handleEditClose}
        handleSave={handleEditSave}
      />
    </Box>
  );
}

function Key({
  data,
  openEditBox,
  handleEditClose,
  handleEditOpen,
  handleEditSave,
  handleRemove,
  className,
}) {
  return (
    <Box className="flex items-center space-x-1">
      <Icons
        data={data}
        openEditBox={openEditBox}
        handleEditClose={handleEditClose}
        handleEditOpen={handleEditOpen}
        handleEditSave={handleEditSave}
        handleRemove={handleRemove}
      />
      <Typography
        variant="body1"
        className="text-xl font-bold whitespace-pre"
        children={data.key}
      />
    </Box>
  );
}

function Value({ data, className }) {
  return (
    <ListItems
      data={data.pairs}
      itemKey="data"
      component={Pair}
      includeDivider={false}
      className="space-y-1.5"
    />
  );
}

export default function EditProperty({
  data,
  className,
  openEditBox,
  handleEditOpen,
  handleEditClose,
  handleEditSave,
  handleRemove,
}) {
  return (
    <Box className={className}>
      <Key
        data={data}
        openEditBox={openEditBox}
        handleEditClose={handleEditClose}
        handleEditOpen={handleEditOpen}
        handleEditSave={handleEditSave}
        handleRemove={handleRemove}
      />
      <Value data={data} />
    </Box>
  );
}
