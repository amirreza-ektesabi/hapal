import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import numberFormat from "src/general/functions/numberFormat";

export default function ObjectStatistic({ title, value, variant }) {
  if (typeof value == "number") value = numberFormat(value);
  let className =
    variant == "vertical"
      ? "grid justify-items-center"
      : "horizontal"
      ? "flex space-x-1"
      : "";
  return (
    <Box className={className}>
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
    </Box>
  );
}
