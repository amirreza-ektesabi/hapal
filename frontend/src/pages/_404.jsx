import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinkButton from "src/components/linkButton";

export default function Error404() {
  return (
    <Box className="flex flex-col justify-center items-center h-screen">
      <Typography variant="h1" className="text-whiteZ font-medium">
        404
      </Typography>
      <Typography variant="h6" className="text-whiteZ">
        Page Not Found
      </Typography>
      <LinkButton name="GO HOME" href="/" className="mt-5" />
    </Box>
  );
}
