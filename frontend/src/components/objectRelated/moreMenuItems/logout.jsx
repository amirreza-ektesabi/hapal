import * as React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AuthContext from "src/components/auth/authContext";
import { authActions } from "src/_store";

export function logoutConditions(data) {
  const { isAuthenticated } = React.useContext(AuthContext);

  return data.type === "account" && isAuthenticated;
}

export default function LogoutItem({ data, placement, handleMenuClose }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleOnClick = () => {
    dispatch(authActions.logout());
    router.reload();
  };

  return (
    <MenuItem onClick={handleOnClick} className="text-sm">
      <ListItemIcon>
        <LogoutRoundedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <Typography children="Logout" />
      </ListItemText>
    </MenuItem>
  );
}
