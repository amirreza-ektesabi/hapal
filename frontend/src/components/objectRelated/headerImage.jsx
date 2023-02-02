import * as React from "react";
import Box from "@mui/material/Box";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CircleIcon from "src/components/circleIcon";
import stringToColor from "src/general/stringToColor";

function ImportPhoto({ data, className }) {
  return (
    <CircleIcon className={className}>
      <AddAPhotoOutlinedIcon className="text-3xl p-1" />
    </CircleIcon>
  );
}

function DeletePhoto({ data, className }) {
  return (
    <CircleIcon className={className}>
      <DeleteOutlineRoundedIcon className="text-3xl p-0.5" />
    </CircleIcon>
  );
}

function EditOverlay({ data, className }) {
  return (
    <Box className={className + " flex place-items-center"}>
      <Box className="m-auto space-x-4">
        <ImportPhoto />
        {data.header && <DeletePhoto />}
      </Box>
    </Box>
  );
}

export default function HeaderImage({
  data,
  className,
  colorDecider = "",
  forEdit = false,
  height = 64,
}) {
  height = height.toString();
  return (
    <Box className={className + " relative w-full bg-blackZ"}>
      <Box
        component={data.header && "img"}
        sx={{
          bgcolor: stringToColor(colorDecider),
          opacity: forEdit ? 0.4 : 1,
        }}
        className={`w-full h-${height} object-cover`}
        src={data.header}
      />
      {forEdit && <EditOverlay data={data} className="absolute inset-0" />}
    </Box>
  );
}
