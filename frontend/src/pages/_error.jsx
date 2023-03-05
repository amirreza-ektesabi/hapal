import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Error404 from "src/pages/404";

export default function Error({ statusCode }) {
  if (statusCode === 404) return <Error404 />;
  return (
    <Box className="flex flex-col justify-center items-center h-screen">
      <Typography variant="h6" className="text-whiteZ">
        An Error Has Occurred!
      </Typography>
    </Box>
  );
}
