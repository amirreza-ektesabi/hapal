import * as React from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import { listUserFollowed } from "../../general/reducers/lists";
import { postUserFollowed } from "../../general/reducers/posts";
import { commentUserFollowed } from "../../general/reducers/comments";

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
        <Grid container className="space-x-1">
          <Typography
            children={data.user.is_followed ? "Follow" : "Unfollow"}
          />
          <Typography className="font-bold" children={data.user.name} />
        </Grid>
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
        <IconButton
          onClick={handleClick}
          className={className}
        >
          <MoreVertRoundedIcon color="white" />
        </IconButton>
      ) : (
        <MoreVertRoundedIcon
          fontSize="small"
          className={className + " fill-greyZ "}
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
