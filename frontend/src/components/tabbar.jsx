import * as React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/SearchRounded";
import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import theme from "src/general/theme";
import urls from "src/general/urls";
import { Box } from "@mui/material";

export default function Tabbar() {
  return (
    <AppBar
      style={{ background: theme.palette.blackZ }}
      className="fixed top-auto bottom-0 left-[50%] -translate-x-[50%] max-w-[calc(32rem+4rem)] sm:rounded-t-3xl h-[3rem] sm:h-[2.5rem] shadow-[0px_0px_2px_2px_rgba(0,0,0,0.3)] justify-center"
    >
      <Toolbar className="justify-center w-full">
        <Box className="flex justify-center w-[70%]">
          <Link href={urls.explore}>
            <SearchIcon className="hover:text-greyZ" titleAccess="Explore" />
          </Link>
          <Box className="grow" />
          <Link href={urls.listNew}>
            <AddIcon className="hover:text-greyZ" titleAccess="New List" />
          </Link>
          <Box className="grow" />
          <Link href={urls.profile}>
            <AccountCircleIcon className="hover:text-greyZ" titleAccess="Profile" />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
