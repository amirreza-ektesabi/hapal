import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ModeCommentRoundedIcon from "@mui/icons-material/ModeCommentRounded";
import numberFormat from "src/general/numberFormat";

export default function Comment({ data, className, iconOnClick }) {
  return (
    <Box className={className + " space-x-1"}>
      <ModeCommentRoundedIcon
        onClick={iconOnClick}
        className="text-xl cursor-pointer hover:fill-greyZ"
      />
      <Typography
        variant="caption"
        color="text.secondary"
        children={numberFormat(data.comments_count)}
      />
    </Box>
  );
}