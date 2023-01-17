import * as React from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import numberFormat from "../../general/numberFormat";
import { listLiked } from "../../general/reducers/lists";
import { postLiked } from "../../general/reducers/posts";
import { commentLiked } from "../../general/reducers/comments";

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

  return (
    <Grid className={className + " space-x-1"}>
      <FavoriteRoundedIcon
        fontSize="small"
        className={data.is_liked ? "fill-redZ" : "fill-greyZ"}
        onClick={handleOnClick}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        children={numberFormat(data.likes_count)}
      />
    </Grid>
  );
}