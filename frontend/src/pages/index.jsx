import * as React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "../general/theme";
import store from "../general/store";

import ProfilePage from "./profile";
import ListPage from "./list";
import PostPage from "./post";
import list_items from "../../public/sample_data/list_items";
import post_items from "../../public/sample_data/post_items";

export default function App() {
  let index = 2;
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {index == 0 ? (
          <ProfilePage />
        ) : index == 1 ? (
          <ListPage uuid={list_items[0].uuid} />
        ) : (
          <PostPage uuid={post_items[0].uuid} />
        )}
      </ThemeProvider>
    </Provider>
  );
}
