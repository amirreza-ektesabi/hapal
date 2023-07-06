import * as React from "react";
import { useRouter } from "next/router";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const AlertContext = React.createContext(null);

export function AlertProvider({ children }) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    message: null,
    mode: null,
  });
  const contextValue = {
    setAlert: (message, mode) => {
      const data = { message, mode };
      localStorage.setItem("alert", JSON.stringify(data));
    },
  };

  React.useEffect(() => {
    let alert = JSON.parse(localStorage.getItem("alert"));
    if (alert !== null) {
      localStorage.removeItem("alert");
      setState(alert);
      setOpen(true);
    }
  }, [router.pathname]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <Alert
        open={open}
        setOpen={setOpen}
        text={state.message}
        mode={state.mode}
      />
    </AlertContext.Provider>
  );
}

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
