import * as React from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import CircleIcon from "src/components/circleIcon";
import { listUserFollowed } from "src/general/reducers/lists";
import { postUserFollowed } from "src/general/reducers/posts";
import { commentUserFollowed } from "src/general/reducers/comments";

const userFollowedReducers = {
  list: listUserFollowed,
  post: postUserFollowed,
  comment: commentUserFollowed,
};

function UserFollowItem({ data, handleMenuClose }) {
  const dispatch = useDispatch();

  const handleOnClick = (event) => {
    const reducer = userFollowedReducers[data.type];
    dispatch(reducer(data.uuid));
    handleMenuClose();
  };

  return (
    <MenuItem onClick={handleOnClick} className="text-sm">
      <ListItemIcon>
        {data.user.is_followed ? (
          <PersonAddAlt1RoundedIcon fontSize="small" />
        ) : (
          <PersonRemoveAlt1RoundedIcon fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText>
        <Box className="flex space-x-1">
          <Typography
            children={data.user.is_followed ? "Follow" : "Unfollow"}
          />
          <Typography className="font-bold" children={data.user.name} />
        </Box>
      </ListItemText>
    </MenuItem>
  );
}

function MoreMenu({ data, menuIsOpen, anchorEl, handleClose }) {
  return (
    <Menu anchorEl={anchorEl} open={menuIsOpen} onClose={handleClose}>
      <UserFollowItem data={data} handleMenuClose={handleClose} />
    </Menu>
  );
}

export default function More({ data, button = false, className }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {button ? (
        <CircleIcon
          onClick={handleClick}
          className={className}
        >
          <MoreVertRoundedIcon color="white" />
        </CircleIcon>
      ) : (
        <MoreVertRoundedIcon
          className={className + " text-xl cursor-pointer hover:fill-greyZ"}
          onClick={handleClick}
        />
      )}
      <MoreMenu
        data={data}
        menuIsOpen={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
    </Box>
  );
}
