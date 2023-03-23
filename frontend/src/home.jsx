import * as React from "react";
import Box from "@mui/material/Box";

export default function TemporaryHomePage() {
  return (
    <Box className="relative">
      <Box
        component="img"
        src="/sample_data/images/Space.jpg"
        className="w-screen h-screen object-cover"
      />
      <Box className="absolute top-44 flex w-full">
        <Box
          component="img"
          src="/sample_data/images/Ghosts.jpg"
          className="mx-auto w-96 h-96"
        />
      </Box>
    </Box>
  );
}
