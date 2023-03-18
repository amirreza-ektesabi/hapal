import * as React from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import theme from "src/general/theme";
import { listsActions, usersActions } from "src/_store";

const followedReducers = {
  account: usersActions.followed,
  list: listsActions.followed,
};

const unfollowedReducers = {
  account: usersActions.unfollowed,
  list: listsActions.unfollowed,
};

function Following({ className, onClick }) {
  return (
    <Button
      variant="outlined"
      className={className}
      sx={{
        color: "text.primary",
        borderColor: "greyZ",
        "&:hover": {
          borderColor: "greyZ",
        },
      }}
      style={{ background: theme.palette.blackZ }}
      children={"Following"}
      onClick={onClick}
    />
  );
}

function Follow({ className, onClick }) {
  return (
    <Button
      variant="contained"
      className={className}
      style={{
        background: "white",
        color: theme.palette.blackZ,
      }}
      children={"Follow"}
      onClick={onClick}
    />
  );
}

export default function FollowButton({ data, className }) {
  className += " rounded-full w-28 h-10 border-1 font-bold";
  const dispatch = useDispatch();

  const handleOnFollow = () => {
    const reducer = followedReducers[data.type];
    dispatch(reducer(data.type == "list" ? data.uuid : data.username));
  };

  const handleOnUnfollow = () => {
    const reducer = unfollowedReducers[data.type];
    dispatch(reducer(data.type == "list" ? data.uuid : data.username));
  };

  return data.is_followed ? (
    <Following onClick={handleOnUnfollow} className={className} />
  ) : (
    <Follow onClick={handleOnFollow} className={className} />
  );
}
