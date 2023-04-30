import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/SearchRounded";
import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import ArrowTooltip from "src/components/arrowTooltip";
import theme from "src/general/theme";
import urls from "src/general/urls";

export default function Tabbar({ appProps }) {
  const router = useRouter();
  const currentPath = router.asPath;

  return (
    <AppBar
      style={{ background: theme.palette.blackZ }}
      className="fixed top-auto bottom-0 left-[50%] -translate-x-[50%] max-w-[calc(32rem+4rem)] sm:rounded-t-3xl h-[3rem] sm:h-[2.5rem] shadow-[0px_0px_2px_2px_rgba(0,0,0,0.3)] justify-center"
    >
      <Toolbar className="justify-center w-full">
        <Box className="flex justify-center w-[70%]">
          <Link href={urls.explore}>
            <ArrowTooltip title="Explore">
              <SearchIcon
                className={
                  "hover:text-greyZ" +
                  (currentPath === urls.explore ? " fill-blueZ" : "")
                }
              />
            </ArrowTooltip>
          </Link>
          <Box className="grow" />
          <Link href={urls.listNew}>
            <ArrowTooltip title="New List">
              <AddIcon
                className={
                  "hover:text-greyZ" +
                  (currentPath === urls.listNew ? " fill-blueZ" : "")
                }
              />
            </ArrowTooltip>
          </Link>
          <Box className="grow" />
          <Link href={urls.profile}>
            <ArrowTooltip title="Profile">
              <AccountCircleIcon
                className={
                  "hover:text-greyZ" +
                  (currentPath === urls.profile ? " fill-blueZ" : "")
                }
              />
            </ArrowTooltip>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
