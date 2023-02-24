import * as React from "react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function Alert({
  open,
  setOpen,
  closeIcon = false,
  text,
  mode,
  autoHideDuration = 3000,
}) {
  const handleOnClose = (event, reason) => {
    if (reason !== "clickaway") setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleOnClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <MuiAlert
        severity={mode}
        sx={{ width: "100%" }}
        children={text}
        elevation={6}
        variant="filled"
        onClose={closeIcon ? handleOnClose : undefined}
        className="whitespace-pre-line"
      />
    </Snackbar>
  );
}
