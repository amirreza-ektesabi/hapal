import * as React from "react";
import Box from "@mui/system/Box";
import Avatar from "@mui/material/Avatar";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import CircleIcon from "src/components/circleIcon";
import stringToColor from "src/general/functions/stringToColor";

function ImportPhoto({ data, className }) {
  return (
    <CircleIcon className={className}>
      <AddAPhotoOutlinedIcon className="text-3xl p-1" />
    </CircleIcon>
  );
}

function EditOverlay({ data, className }) {
  return (
    <Box className={className + " flex place-items-center"}>
      <Box className="m-auto space-x-4">
        <ImportPhoto />
      </Box>
    </Box>
  );
}

export default function ProfileAvatar({ data, className, forEdit = false }) {
  return (
    <Box className="relative rounded-full bg-blackZ">
      <Avatar
        src={data.avatar}
        sx={{ bgcolor: stringToColor(data.name), opacity: forEdit ? 0.4 : 1 }}
        className="w-20 h-20 text-4xl mr-auto border-[3px] border-blackZ"
        children={data.name[0]}
      />
      {forEdit && <EditOverlay data={data} className="absolute inset-0" />}
    </Box>
  );
}
