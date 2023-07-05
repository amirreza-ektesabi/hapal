import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AuthContext from "src/components/auth/authContext";
import theme from "src/general/theme";

export default function Authbar() {
  const { openLoginBox, openSignupBox } = React.useContext(AuthContext);

  return (
    <AppBar
      className="fixed top-0 bottom-auto w-full h-[3rem] tablet:h-[3.5rem] justify-center backdrop-blur"
      sx={{ background: theme.palette.blueZ }}
    >
      <Toolbar className="justify-center w-full">
        <Box className="flex w-full mx-8 laptop:max-w-[58rem] desktop:max-w-[70rem] place-items-center px-1">
          <Typography
            className="text-[0rem] mobile:text-base tablet:text-xl text-whiteZ mt-[2px] font-medium"
            children="You are not logged in."
          />
          <Box className="grow" />
          <Box className="flex space-x-2">
            <Button
              variant="contained"
              className="rounded-full bg-whiteZ text-blueZ font-bold text-sm tablet:text-base tablet:px-6"
              children="Sign up"
              onClick={openSignupBox}
            />
            <Button
              variant="outlined"
              className="rounded-full bg-transparent border-2 border-whiteZ text-whiteZ font-bold text-sm tablet:text-base tablet:px-6"
              children="Log in"
              onClick={openLoginBox}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
