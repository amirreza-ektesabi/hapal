import * as React from "react";
import TextField from "@mui/material/TextField";

export default function AutoFocusTextField({ inputRef, ...props }) {
  if (inputRef === undefined) inputRef = React.useRef();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current.focus();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return <TextField inputRef={inputRef} {...props} />;
}
