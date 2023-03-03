import * as React from "react";
import Typography from "@mui/material/Typography";
import { timeAgo } from "src/_helpers";

export default function Date({ data, className }) {
  return (
    <React.StrictMode>
      <Typography
        variant="caption"
        color="text.secondary"
        className={className}
      >
        ·&nbsp;&nbsp;{timeAgo(data)}
      </Typography>
    </React.StrictMode>
  );
}
