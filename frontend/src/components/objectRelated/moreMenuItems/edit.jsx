import * as React from "react";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { stringFormat } from "src/_helpers";
import urls from "src/general/urls";
import AuthContext from "src/components/auth/authContext";

const urlMap = {
  list: urls.listEdit,
  post: urls.postEdit,
};

export function editItemConditions(data) {
  const { currentUser } = React.useContext(AuthContext);

  return (
    Object.keys(urlMap).includes(data.type) &&
    currentUser?.username == data.user.username
  );
}

export default function EditItem({ data, placement, handleMenuClose }) {
  const router = useRouter();

  const handleOnClick = (event) => {
    const editUrl = stringFormat(urlMap[data.type], data.uuid);
    router.push(editUrl);
    handleMenuClose();
  };

  return (
    <MenuItem onClick={handleOnClick} className="text-sm">
      <ListItemIcon>
        <EditRoundedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <Typography children="Edit" />
      </ListItemText>
    </MenuItem>
  );
}
