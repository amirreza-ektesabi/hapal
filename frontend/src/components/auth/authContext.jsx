import React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import store from "src/_store";
import Authbar from "src/components/authbar";
import LoginDialog from "src/components/auth/loginDialog";
import SignupDialog from "src/components/auth/signupDialog";

const AuthContext = React.createContext(null);

export default AuthContext;

export function AuthProvider({ children }) {
  const router = useRouter();

  const [openLoginBox, setOpenLoginBox] = React.useState(false);
  const handleOpenLoginBox = () => setOpenLoginBox(true);
  const handleCloseLoginBox = () => setOpenLoginBox(false);

  const [openSignupBox, setOpenSignupBox] = React.useState(false);
  const handleOpenSignupBox = () => setOpenSignupBox(true);
  const handleCloseSignupBox = () => setOpenSignupBox(false);

  const state = store.getState().auth;
  const contextValue = {
    openLoginBox: handleOpenLoginBox,
    openSignupBox: handleOpenSignupBox,
    isAuthenticated: !!state.user,
    currentUser: {
      ...state.user,
    },
  };

  const isHomePage = router.pathname === "/";
  const includeAuthbar = !isHomePage && !state.user;

  return (
    <AuthContext.Provider value={contextValue}>
      {includeAuthbar && <Authbar />}
      <Box className={includeAuthbar ? "mt-[3rem]" : ""} />
      {children}
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
    </AuthContext.Provider>
  );
}
