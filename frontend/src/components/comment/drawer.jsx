import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ListItems from "../listItems";
import CommentPreview from "./preview";
import theme from "../../general/theme";
import { commentAdded } from "../../general/reducers/comments";

function getAnchor() {
  return typeof window === "undefined" || window.innerWidth > 640
    ? "right"
    : "bottom";
}

function TitleBar({ toggleDrawer, className }) {
  return (
    <Grid className="flex ml-4 items-center">
      <Typography
        variant="h6"
        color="greyZ"
        className="font-medium"
        children="Comments"
      />
      <CloseRounded className="ml-auto mr-4" onClick={toggleDrawer(false)} />
    </Grid>
  );
}

function ReplyBox({
  textInputBody,
  replyButtonIsEnable,
  handleTextInputChange,
  handleClickOnReplyButton,
  className,
}) {
  return (
    <Grid className="px-4 space-y-1">
      <TextField
        multiline
        variant="outlined"
        className="w-full"
        onChange={handleTextInputChange}
        inputProps={{ maxLength: 512 }}
        InputProps={{ className: "text-sm items-end" }}
        value={textInputBody}
      />
      <Box className="flex">
        <Button
          variant="contained"
          size="small"
          className="rounded-full px-4 ml-auto"
          children="Reply"
          style={{
            background: replyButtonIsEnable ? theme.palette.blueZ : "grey",
          }}
          onClick={handleClickOnReplyButton}
        />
      </Box>
    </Grid>
  );
}

function Timeline({ uuids }) {
  return (
    <ListItems
      data={uuids}
      itemKey="uuid"
      component={CommentPreview}
      itemComponentClassName="mx-4"
      className="mt-2"
    />
  );
}

export default function CommentDrawer({
  uuids = [],
  toggleDrawer,
  drawerIsOpen,
}) {
  const [anchor, setAnchor] = React.useState(getAnchor());
  const [replyButtonIsEnable, setReplyButtonIsEnable] = React.useState(false);
  const [textInputBody, setTextInputBody] = React.useState("");

  const handleTextInputChange = (event) => {
    let text = event.target.value;
    setTextInputBody(text);
    setReplyButtonIsEnable(text.trim().length !== 0);
  };

  const handleClickOnReplyButton = (event) => {
    setTextInputBody("");
    setReplyButtonIsEnable(false);
  };

  React.useEffect(() => {
    function handleWindowResize() {
      setAnchor(getAnchor());
    }
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <SwipeableDrawer
      anchor={anchor}
      open={drawerIsOpen}
      onOpen={toggleDrawer(true)}
      onClose={toggleDrawer(false)}
    >
      <Box
        sx={{ ...(anchor == "right" && { width: 450 }), height: "80vh" }}
        role="presentation"
        onClose={() => toggleDrawer(false)}
        className="space-y-2 mt-2"
      >
        <TitleBar toggleDrawer={toggleDrawer} />
        <ReplyBox
          textInputBody={textInputBody}
          replyButtonIsEnable={replyButtonIsEnable}
          handleTextInputChange={handleTextInputChange}
          handleClickOnReplyButton={handleClickOnReplyButton}
        />
        <Timeline uuids={uuids} />
      </Box>
    </SwipeableDrawer>
  );
}
