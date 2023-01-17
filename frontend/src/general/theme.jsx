import { createTheme } from "@mui/material/styles";
import { blue, red, grey } from "@mui/material/colors";

export default createTheme({
  typography: {
    fontFamily: "Roboto",
    button: "body1",
  },
  palette: {
    mode: "dark",
    primary: blue,
    blackZ: "#121212",
    whiteZ: "#d8d8d8",
    greyZ: grey["400"],
    blueZ: blue["700"],
    favorite: red["600"],
    divider: "#27272a",
    text: {
      primary: "#d8d8d8",
      secondary: grey["400"],
    },
  },
});
