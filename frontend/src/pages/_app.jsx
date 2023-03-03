import * as React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NoSsr from "@mui/material/NoSsr";
import darkTheme from "src/general/theme";
import store from "src/_store";
import "styles/global.css";
import "tailwindcss/tailwind.css";

export default function App({ Component, pageProps }) {
  React.useEffect(() => {
    document.title = "Hapal";
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <NoSsr>
          <CssBaseline />
          <Component {...pageProps} />
        </NoSsr>
      </ThemeProvider>
    </Provider>
  );
}
