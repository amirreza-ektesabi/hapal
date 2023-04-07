import "styles/global.css";
import "tailwindcss/tailwind.css";
import * as React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NoSsr from "@mui/material/NoSsr";
import darkTheme from "src/general/theme";
import store from "src/_store";
import LoginButton from "src/components/auth/loginButton";
import LogoutButton from "src/components/auth/logoutButton";
import AuthContext from "src/components/auth/authContext";
import LoginDialog from "src/components/auth/loginDialog";
import SignupDialog from "src/components/auth/signupDialog";
import { pageTitle } from "src/_helpers";

function AuthButtons({ className }) {
  const { isAuthenticated } = React.useContext(AuthContext);

  return (
    <React.StrictMode>
      {isAuthenticated ? (
        <LogoutButton className={className} />
      ) : (
        <LoginButton className={className} />
      )}
    </React.StrictMode>
  );
}

export default function App({ Component, pageProps, ...appProps }) {
  React.useEffect(() => {
    document.title = pageTitle();
  }, []);

  const [openLoginBox, setOpenLoginBox] = React.useState(false);
  const handleOpenLoginBox = () => setOpenLoginBox(true);
  const handleCloseLoginBox = () => setOpenLoginBox(false);

  const [openSignupBox, setOpenSignupBox] = React.useState(false);
  const handleOpenSignupBox = () => setOpenSignupBox(true);
  const handleCloseSignupBox = () => setOpenSignupBox(false);

  const authState = store.getState().auth;
  const authContextValue = {
    openLoginBox: handleOpenLoginBox,
    openSignupBox: handleOpenSignupBox,
    isAuthenticated: !!authState.user,
    currentUser: {
      ...authState.user,
    },
  };

  const isHomePage = appProps.router.pathname === "/";

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <NoSsr>
          <CssBaseline />
          <AuthContext.Provider value={authContextValue}>
            <Component {...pageProps} />
            {!isHomePage && <AuthButtons className="absolute top-4 right-4" />}
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
        </NoSsr>
      </ThemeProvider>
    </Provider>
  );
}
