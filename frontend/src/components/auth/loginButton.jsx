import * as React from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import theme from "src/general/theme";
import { authSelectors } from "src/_store";
import LoginDialog from "src/components/auth/loginDialog";
import SignupDialog from "./signupDialog";

export default function LoginButton({
  className,
  openLoginBox,
  handleOpenLoginBox,
  handleCloseLoginBox,
}) {
  const authUser = useSelector(authSelectors.selectUser);
  const [openSignupBox, setOpenSignupBox] = React.useState(false);

  const handleOpenSignupBox = () => setOpenSignupBox(true);
  const handleCloseSignupBox = () => setOpenSignupBox(false);

  return (
    <React.StrictMode>
      {!authUser && (
        <Button
          variant="contained"
          style={{
            background: "white",
            color: theme.palette.blackZ,
          }}
          className={className + " px-4 font-black"}
          onClick={handleOpenLoginBox}
          children="Log in"
        />
      )}
      <LoginDialog
        open={openLoginBox}
        handleClose={handleCloseLoginBox}
        handleOpenSignupBox={handleOpenSignupBox}
      />
      <SignupDialog
        open={openSignupBox}
        handleClose={handleCloseSignupBox}
        handleOpenLoginBox={handleOpenLoginBox}
      />
    </React.StrictMode>
  );
}
