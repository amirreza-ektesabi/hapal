import * as React from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { numberFormat } from "src/_helpers";
import { listsActions, postsActions, commentsActions } from "src/_store";
import { withAuthFunction } from "src/components/auth/withAuth";

const likedReducers = {
  list: listsActions.liked,
  post: postsActions.liked,
  comment: commentsActions.liked,
};

const unlikedReducers = {
  list: listsActions.unliked,
  post: postsActions.unliked,
  comment: commentsActions.unliked,
};

export default function Favorite({ data, className }) {
  const dispatch = useDispatch();

  const handleOnClick = withAuthFunction((event) => {
    const reducer = data.is_liked
      ? unlikedReducers[data.type]
      : likedReducers[data.type];
    dispatch(reducer(data.uuid));
  });

  const colorClassName = data.is_liked
    ? "fill-redZ"
    : "fill-whiteZ hover:fill-greyZ";

  return (
    <Box className={className + " space-x-1"}>
      <FavoriteRoundedIcon
        onClick={handleOnClick}
        className={colorClassName + " text-xl cursor-pointer"}
        titleAccess="Like"
      />
      <Typography
        variant="caption"
        color="text.secondary"
        children={numberFormat(data.likes_count)}
      />
    </Box>
  );
}
