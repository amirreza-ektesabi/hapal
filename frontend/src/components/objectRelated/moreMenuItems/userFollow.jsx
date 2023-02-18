import * as React from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import { listUserFollowed, postUserFollowed, commentUserFollowed } from "src/_store";

const reducerMap = {
  list: listUserFollowed,
  post: postUserFollowed,
  comment: commentUserFollowed,
};

export default function UserFollowItem({ data, handleMenuClose }) {
  const dispatch = useDispatch();

  const handleOnClick = () => {
    const reducer = reducerMap[data.type];
    dispatch(reducer(data.uuid));
    handleMenuClose();
  };

  return (
    <MenuItem onClick={handleOnClick} className="text-sm">
      <ListItemIcon>
        {data.user.is_followed ? (
          <PersonRemoveAlt1RoundedIcon fontSize="small" />
        ) : (
          <PersonAddAlt1RoundedIcon fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText>
        <Box className="flex space-x-1">
          <Typography
            children={data.user.is_followed ? "Unfollow" : "Follow"}
          />
          <Typography className="font-bold" children={data.user.name} />
        </Box>
      </ListItemText>
    </MenuItem>
  );
}
