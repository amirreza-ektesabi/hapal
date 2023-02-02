import * as React from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import theme from "src/general/theme";
import { userFollowed } from "src/general/reducers/users";
import { listFollowed } from "src/general/reducers/lists";

const followedReducers = {
  account: userFollowed,
  list: listFollowed,
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

  const handleOnClick = (event) => {
    const reducer = followedReducers[data.type];
    dispatch(reducer(data.type == "list" ? data.uuid : data.username ));
  };

  return data.is_followed ? (
    <Following onClick={handleOnClick} className={className} />
  ) : (
    <Follow onClick={handleOnClick} className={className} />
  );
}
