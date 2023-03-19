import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import { usersActions, usersSelectors } from "src/_store";
import { withAuthFunction } from "src/components/auth/withAuth";
import AuthContext from "src/components/auth/authContext";

export function UserFollowItemConditions(data) {
  const { currentUser } = React.useContext(AuthContext);

  return currentUser?.username != data.user.username;
}

export default function UserFollowItem({ data, handleMenuClose }) {
  const user = useSelector((state) =>
    usersSelectors.selectByUsername(state, data.user.username)
  );
  const dispatch = useDispatch();

  const handleOnClick = withAuthFunction(() => {
    const reducer = user.is_followed
      ? usersActions.unfollowed
      : usersActions.followed;
    dispatch(reducer(user.username));
  });

  return (
    <MenuItem
      onClick={() => {
        handleOnClick();
        handleMenuClose();
      }}
      className="text-sm"
    >
      <ListItemIcon>
        {user.is_followed ? (
          <PersonRemoveAlt1RoundedIcon fontSize="small" />
        ) : (
          <PersonAddAlt1RoundedIcon fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText>
        <Box className="flex space-x-1">
          <Typography children={user.is_followed ? "Unfollow" : "Follow"} />
          <Typography className="font-bold" children={user.name} />
        </Box>
      </ListItemText>
    </MenuItem>
  );
}
