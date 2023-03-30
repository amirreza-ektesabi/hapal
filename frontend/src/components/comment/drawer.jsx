import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import CloseRounded from "@mui/icons-material/CloseRounded";
import Loading from "src/components/loading";
import ListItems from "src/components/listItems";
import CommentPreview from "src/components/comment/preview";
import ReplyBox from "src/components/comment/replyBox";
import { withAuthFunction } from "src/components/auth/withAuth";
import { getListComments, getPostComments } from "api";
import { commentsActions, commentsSelectors } from "src/_store";
import { useSwrNoFocus } from "src/_helpers";

const swrFetcherMap = {
  list: getListComments,
  post: getPostComments,
};

function getAnchor() {
  return typeof window === "undefined" || window.innerWidth > 640
    ? "right"
    : "bottom";
}

const iOS =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

function TitleBar({ toggleDrawer, className }) {
  return (
    <Box className="flex ml-4 items-center">
      <Typography
        variant="h6"
        color="greyZ"
        className="font-medium"
        children="Comments"
      />
      <CloseRounded
        className="ml-auto mr-4 cursor-pointer hover:fill-greyZ"
        onClick={toggleDrawer(false)}
      />
    </Box>
  );
}

function CommentList({ uuids, isLoading, isError }) {
  return (
    <React.StrictMode>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        ""
      ) : (
        <ListItems
          data={uuids}
          itemKey="uuid"
          component={CommentPreview}
          itemComponentClassName="mx-4"
          className="mt-2"
        />
      )}
    </React.StrictMode>
  );
}

export default function CommentDrawer({
  repliedTo,
  toggleDrawer,
  drawerIsOpen,
}) {
  const dispatch = useDispatch();
  const [anchor, setAnchor] = React.useState(getAnchor());
  const [replyButtonIsEnable, setReplyButtonIsEnable] = React.useState(false);
  const [textInputBody, setTextInputBody] = React.useState("");

  let uuids = useSelector((state) =>
    commentsSelectors.selectUuidsByRepliedTo(state, repliedTo)
  );

  const handleTextInputChange = (event) => {
    let text = event.target.value;
    setTextInputBody(text);
    setReplyButtonIsEnable(text.trim().length !== 0);
  };

  const handleClickOnReplyButton = withAuthFunction((event) => {
    dispatch(commentsActions.created({ body: textInputBody, repliedTo }));
    setTextInputBody("");
    setReplyButtonIsEnable(false);
  });

  const swrKey = `comments/${repliedTo.type}/${repliedTo.uuid}`;
  const swrFetcher = () => swrFetcherMap[repliedTo.type](repliedTo.uuid);
  const { data: response, isLoading } = useSwrNoFocus(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    if (!isLoading && !isError)
      dispatch(
        commentsActions.retrievedList({
          list: response.data,
          repliedToUuid: repliedTo.uuid,
          repliedToType: repliedTo.type,
        })
      );
  }, [response]);

  React.useEffect(() => {
    const handleWindowResize = () => setAnchor(getAnchor());
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  return (
    <SwipeableDrawer
      anchor={anchor}
      open={drawerIsOpen}
      onOpen={toggleDrawer(true)}
      onClose={toggleDrawer(false)}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      id="__next"
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
        <CommentList uuids={uuids} isLoading={isLoading} isError={isError} />
      </Box>
    </SwipeableDrawer>
  );
}
