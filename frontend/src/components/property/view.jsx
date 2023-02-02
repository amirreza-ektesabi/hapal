import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ListItems from "src/components/listItems";
import { selectPropertyByPuuid } from "src/general/reducers/properties";
import EditPropertyBox from "src/components/property/editBox";

function Key({
  data,
  forEdit,
  puuid,
  openEditPropertyBox,
  handleEditClose,
  handleEditOpen,
  className,
}) {
  return (
    <Box className="flex items-center space-x-1">
      {forEdit && (
        <EditIcons
          puuid={puuid}
          openEditPropertyBox={openEditPropertyBox}
          handleEditClose={handleEditClose}
          handleEditOpen={handleEditOpen}
        />
      )}
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

function EditIcons({
  puuid,
  openEditPropertyBox,
  handleEditClose,
  handleEditOpen,
}) {
  return (
    <Box className="mb-1 space-x-1">
      <EditRoundedIcon
        className="text-xl cursor-pointer hover:fill-greyZ"
        onClick={() => handleEditOpen(puuid)}
      />
      <DeleteRoundedIcon className="text-xl cursor-pointer hover:text-greyZ" />
      <EditPropertyBox
        puuid={puuid}
        open={openEditPropertyBox === puuid}
        handleClose={handleEditClose}
      />
    </Box>
  );
}

function Pair({ data, className }) {
  return (
    <Box className={className}>
      <Typography
        variant="body2"
        className="font-normal whitespace-pre-wrap"
        color="text.secondary"
        children={data.key}
      />
      <Typography
        variant="body1"
        className="font-normal whitespace-pre-wrap"
        children={data.value}
      />
    </Box>
  );
}

export function EditProperty({ ...props }) {
  return <Property {...props} forEdit={true} />;
}

export default function Property({
  puuid,
  className,
  forEdit = false,
  openEditPropertyBox,
  handleEditOpen,
  handleEditClose,
}) {
  const data = useSelector((state) => selectPropertyByPuuid(state, puuid));
  return (
    <Box className={className}>
      <Key
        data={data}
        forEdit={forEdit}
        puuid={puuid}
        openEditPropertyBox={openEditPropertyBox}
        handleEditClose={handleEditClose}
        handleEditOpen={handleEditOpen}
      />
      <Value data={data} />
    </Box>
  );
}
