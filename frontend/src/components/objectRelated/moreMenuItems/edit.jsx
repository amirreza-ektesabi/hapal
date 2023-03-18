import * as React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { stringFormat } from "src/_helpers";
import { authSelectors } from "src/_store";
import urls from "src/general/urls";

const urlMap = {
  list: urls.listEdit,
  post: urls.postEdit,
};

export function editItemConditions(data) {
  const currentUser = useSelector(authSelectors.selectMe);

  return (
    currentUser.username == data.user.username &&
    Object.keys(urlMap).includes(data.type)
  );
}

export default function EditItem({ data, handleMenuClose }) {
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
