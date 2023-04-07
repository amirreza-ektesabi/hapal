import * as React from "react";
import Button from "@mui/material/Button";
import theme from "src/general/theme";
import AuthContext from "src/components/auth/authContext";

export default function LoginButton({ className }) {
  const { openLoginBox } = React.useContext(AuthContext);

  return (
    <Button
      variant="contained"
      style={{
        background: "white",
        color: theme.palette.blackZ,
      }}
      className={className + " px-4 font-black rounded-full"}
      onClick={openLoginBox}
      children="Log in"
    />
  );
}
