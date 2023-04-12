import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import theme from "src/general/theme";

export default function SaveButton({ className, isEnable, handleOnClick }) {
  return (
    <Box className={className + " flex"}>
      <Button
        disabled={!isEnable}
        variant="contained"
        className="px-4 ml-auto rounded-full w-24 h-10 font-bold"
        children="Save"
        style={{
          background: isEnable ? theme.palette.blueZ : "grey",
        }}
        onClick={handleOnClick}
      />
    </Box>
  );
}
