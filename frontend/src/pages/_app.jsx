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

export default function App({ Component, pageProps }) {
  React.useEffect(() => {
    document.title = "Hapal";
  }, []);

  const [openLoginBox, setOpenLoginBox] = React.useState(false);
  const handleOpenLoginBox = () => setOpenLoginBox(true);
  const handleCloseLoginBox = () => setOpenLoginBox(false);

  const authState = store.getState().auth;
  const authContextValue = {
    openLoginBox: handleOpenLoginBox,
    isAuthenticated: !!authState.user,
    currentUser: {
      ...authState.user,
    },
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <NoSsr>
          <CssBaseline />
          <AuthContext.Provider value={authContextValue}>
            <Component {...pageProps} />
          </AuthContext.Provider>
          <LoginButton
            className="absolute top-4 right-4"
            openLoginBox={openLoginBox}
            handleOpenLoginBox={handleOpenLoginBox}
            handleCloseLoginBox={handleCloseLoginBox}
          />
          <LogoutButton className="absolute top-4 right-4" />
        </NoSsr>
      </ThemeProvider>
    </Provider>
  );
}
