import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TypographyLinkify from "src/components/typographyLinkify";

export default function Pair({ data, className }) {
  return (
    <Box className={className}>
      <Typography
        variant="body2"
        className="font-normal whitespace-pre-wrap break-words"
        color="text.secondary"
        children={data.key}
      />
      <TypographyLinkify
        variant="body1"
        className="font-normal whitespace-pre-wrap break-words"
        children={data.value}
      />
    </Box>
  );
}
