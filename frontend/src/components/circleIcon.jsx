import * as React from "react";
import IconButton from "@mui/material/IconButton";

export default function CircleIcon({ className, ...props }) {
  const { children, ...otherProps } = props;
  return (
    <IconButton
      className={className + " bg-blackZ/[.7] hover:bg-blackZ/[.7]"}
      {...otherProps}
    >
      {children}
    </IconButton>
  );
}
