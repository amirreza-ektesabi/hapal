import * as React from "react";
import Typography from "@mui/material/Typography";
import NoSsr from "@mui/material/NoSsr";
import { timeAgo } from "src/general/datetimeFormat";

export default function Date({ data, className }) {
  return (
    <NoSsr>
      <Typography
        variant="caption"
        color="text.secondary"
        className={className}
      >
        ·&nbsp;&nbsp;{timeAgo(data)}
      </Typography>
    </NoSsr>
  );
}
