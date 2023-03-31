import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ListItems from "src/components/listItems";
import SetPropertyBox from "src/components/property/setBox";
import Pair from "src/components/pair/view";

function Icons({ data, handleRemove, handleEdit }) {
  const [openEditBox, setOpenEditBox] = React.useState(false);

  const handleOpenEditBox = () => setOpenEditBox(true);
  const handleCloseEditBox = () => setOpenEditBox(false);

  return (
    <Box className="mb-1 space-x-1">
      <EditRoundedIcon
        className="text-xl cursor-pointer hover:fill-greyZ"
        onClick={handleOpenEditBox}
      />
      <DeleteRoundedIcon
        className="text-xl cursor-pointer hover:text-greyZ"
        onClick={() => handleRemove(data.index)}
      />
      <SetPropertyBox
        data={data}
        open={openEditBox}
        handleClose={handleCloseEditBox}
        handleSave={handleEdit}
        action="edit"
      />
    </Box>
  );
}

function Key({ data, handleEdit, handleRemove, className }) {
  return (
    <Box className="flex items-center space-x-1">
      <Icons data={data} handleEdit={handleEdit} handleRemove={handleRemove} />
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
  handleEdit,
  handleRemove,
}) {
  return (
    <Box className={className}>
      <Key data={data} handleRemove={handleRemove} handleEdit={handleEdit} />
      <Value data={data} />
    </Box>
  );
}
