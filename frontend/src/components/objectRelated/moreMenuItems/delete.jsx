import * as React from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AuthContext from "src/components/auth/authContext";

export function deleteItemConditions(data) {
  const { currentUser } = React.useContext(AuthContext);

  return currentUser?.username == data.user.username;
}

export default function DeleteItem({ data, handleMenuClose }) {
  const dispatch = useDispatch();

  const handleOnClick = (event) => {
    handleMenuClose();
  };

  return (
    <MenuItem onClick={handleOnClick} className="text-sm">
      <ListItemIcon>
        <DeleteRoundedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <Typography children="Delete" />
      </ListItemText>
    </MenuItem>
  );
}
