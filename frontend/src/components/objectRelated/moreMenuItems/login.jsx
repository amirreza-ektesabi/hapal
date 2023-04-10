import * as React from "react";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AuthContext from "src/components/auth/authContext";

export function loginConditions(data) {
  const { isAuthenticated } = React.useContext(AuthContext);

  return data.type === "account" && !isAuthenticated;
}

export default function LoginItem({ data, placement, handleMenuClose }) {
  const { openLoginBox } = React.useContext(AuthContext);

  const handleOnClick = () => {
    openLoginBox();
  };

  return (
    <MenuItem onClick={handleOnClick} className="text-sm">
      <ListItemIcon>
        <LoginRoundedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <Typography children="Login" />
      </ListItemText>
    </MenuItem>
  );
}
