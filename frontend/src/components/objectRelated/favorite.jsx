import * as React from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import numberFormat from "src/general/functions/numberFormat";
import { listLiked } from "src/general/reducers/lists";
import { postLiked } from "src/general/reducers/posts";
import { commentLiked } from "src/general/reducers/comments";

const likedReducers = {
  list: listLiked,
  post: postLiked,
  comment: commentLiked,
};

export default function Favorite({ data, className }) {
  const dispatch = useDispatch();

  const handleOnClick = (event) => {
    const reducer = likedReducers[data.type];
    dispatch(reducer(data.uuid));
  };

  const colorClassName = data.is_liked
    ? "fill-redZ"
    : "fill-whiteZ hover:fill-greyZ";

  return (
    <Box className={className + " space-x-1"}>
      <FavoriteRoundedIcon
        onClick={handleOnClick}
        className={colorClassName + " text-xl cursor-pointer"}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        children={numberFormat(data.likes_count)}
      />
    </Box>
  );
}
