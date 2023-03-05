import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading({ className, fullScreen = false }) {
  return (
    <Box
      className={
        className +
        ` ${
          fullScreen ? "h-screen" : ""
        } flex h-full items-center justify-center`
      }
    >
      <CircularProgress />
    </Box>
  );
}
