import * as React from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

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
