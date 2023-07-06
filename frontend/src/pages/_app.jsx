import "styles/global.css";
import "tailwindcss/tailwind.css";
import * as React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import NoSsr from "@mui/material/NoSsr";
import CssBaseline from "@mui/material/CssBaseline";
import store from "src/_store";
import darkTheme from "src/general/theme";
import Tabbar from "src/components/tabbar";
import { AlertProvider } from "src/components/alert";
import { AuthProvider } from "src/components/auth/authContext";
import { pageTitle } from "src/_helpers";

export default function App({ Component, pageProps, ...appProps }) {
  React.useEffect(() => {
    document.title = pageTitle();
  }, []);

  const isHomePage = appProps.router.pathname === "/";

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <NoSsr>
          <CssBaseline />
          <AlertProvider>
            <AuthProvider>
              <Component {...pageProps} />
              {!isHomePage && <Tabbar />}
            </AuthProvider>
          </AlertProvider>
        </NoSsr>
      </ThemeProvider>
    </Provider>
  );
}
