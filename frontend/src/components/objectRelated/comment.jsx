import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import ModeCommentRoundedIcon from "@mui/icons-material/ModeCommentRounded";
import numberFormat from "../../general/numberFormat";

export default function Comment({ data, className, iconOnClick }) {
  return (
    <Grid className={className + " space-x-1"}>
      <ModeCommentRoundedIcon
        fontSize="small"
        className="fill-greyZ"
        onClick={iconOnClick}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        children={numberFormat(data.comments_count)}
      />
    </Grid>
  );
}