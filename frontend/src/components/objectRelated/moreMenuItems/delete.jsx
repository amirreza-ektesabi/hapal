import * as React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AuthContext from "src/components/auth/authContext";
import DisposableButton from "src/components/disposableButton";
import { listsActions, postsActions, commentsActions } from "src/_store";
import { stringFormat } from "src/_helpers";
import urls from "src/general/urls";

const deletedReducerMap = {
  list: listsActions.deleted,
  post: postsActions.deleted,
  comment: commentsActions.deleted,
};

export function deleteItemConditions(data) {
  const { currentUser } = React.useContext(AuthContext);

  return (
    Object.keys(deletedReducerMap).includes(data.type) &&
    currentUser?.username == data.user.username
  );
}

function AlertDialog({ data, open, handleClose, handleOnDelete }) {
  String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Delete ${data.type.capitalizeFirstLetter()}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Are you sure you want to delete this ${data.type}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DisposableButton onClick={handleClose}>Cancel</DisposableButton>
        <DisposableButton onClick={handleOnDelete}>Delete</DisposableButton>
      </DialogActions>
    </Dialog>
  );
}

export default function DeleteItem({ data, placement, handleMenuClose }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [openAlertDialog, setOpenAlertDialog] = React.useState(false);

  const handleOpenAlertDialog = () => setOpenAlertDialog(true);
  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
    handleMenuClose();
  };
  const handleOnClick = () => handleOpenAlertDialog();
  const redirectAfterDelete = () => {
    let redirectUrl;
    if (data.type === "post")
      redirectUrl = stringFormat(urls.list, data.added_to.uuid);
    else if (data.type === "list")
      redirectUrl = stringFormat(urls.user, data.user.username);
    if (redirectUrl) router.replace(redirectUrl);
  };
  const handleOnDelete = () => {
    const deletedReducer = deletedReducerMap[data.type];
    dispatch(deletedReducer(data));
    handleCloseAlertDialog();
    if (placement === "header") redirectAfterDelete();
  };

  return (
    <React.StrictMode>
      <MenuItem onClick={handleOnClick} className="text-sm">
        <ListItemIcon>
          <DeleteRoundedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <Typography children="Delete" />
        </ListItemText>
      </MenuItem>
      <AlertDialog
        data={data}
        open={openAlertDialog}
        handleClose={handleCloseAlertDialog}
        handleOnDelete={handleOnDelete}
      />
    </React.StrictMode>
  );
}
