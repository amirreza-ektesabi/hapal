import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import numberFormat from "src/general/numberFormat";

export default function ObjectStatistic({ title, value, variant }) {
  if (typeof value == "number") value = numberFormat(value);
  let className =
    variant == "vertical"
      ? "grid justify-items-center"
      : "horizontal"
      ? "flex space-x-1"
      : "";
  return (
    <Grid className={className}>
      <Typography variant="body1" className="font-bold">
        {value}
      </Typography>
      <Typography
        variant="body1"
        className="font-normal"
        color="text.secondary"
      >
        {title}
      </Typography>
    </Grid>
  );
}
