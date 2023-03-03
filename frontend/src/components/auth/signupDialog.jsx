import * as React from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoFocusTextField from "src/components/autoFocusTextField";
import PasswordTextField from "src/components/auth/passwordTextField";
import Alert from "src/components/alert";
import theme from "src/general/theme";
import messages from "src/general/messages";
import { signup } from "src/_store";
import { validateSignupForm } from "src/_helpers/validators";

function UsernameTextField({ className, setFieldText }) {
  return (
    <AutoFocusTextField
      label="Username"
      variant="outlined"
      margin="dense"
      onChange={setFieldText}
      className={className + " w-full rounded-md"}
    />
  );
}

function EmailTextField({ className, setFieldText }) {
  return (
    <TextField
      label="Email"
      variant="outlined"
      margin="dense"
      onChange={setFieldText}
      className={className + " w-full rounded-md"}
    />
  );
}

function SubmitButton({ className, isEnable, handleOnClick }) {
  return (
    <Button
      variant="contained"
      className={className + " w-full font-medium"}
      style={{
        background: isEnable ? "white" : "grey",
        color: theme.palette.blackZ,
      }}
      children="Sign up"
      onClick={handleOnClick}
      disabled={!isEnable}
    />
  );
}

function LinkToLogin({ handleCloseDialog, handleOpenLoginBox, className }) {
  const handleOnClick = () => {
    handleCloseDialog();
    handleOpenLoginBox();
  };

  return (
    <Box className={className + " flex flex-row space-x-1"}>
      <Typography variant="body2" children="Have an account already?" />
      <Typography
        variant="body2"
        children="Log in"
        className="cursor-pointer text-blueZ hover:underline"
        onClick={handleOnClick}
      />
    </Box>
  );
}

function Title({ handleCloseDialog }) {
  return (
    <DialogTitle className="flex">
      {"Join Hapal Toady"}
      <IconButton onClick={handleCloseDialog} className="ml-auto -mt-1">
        <CloseRoundedIcon className="fill-greyZ" />
      </IconButton>
    </DialogTitle>
  );
}

function Content({
  data,
  submitButtonEnable,
  setFieldText,
  handleOnSubmit,
  handleCloseDialog,
  handleOpenLoginBox,
}) {
  return (
    <DialogContent className="my-4 flex flex-col place-items-center space-y-6">
      <UsernameTextField
        setFieldText={(event) => setFieldText(event, "username")}
      />
      <EmailTextField setFieldText={(event) => setFieldText(event, "email")} />
      <PasswordTextField
        setFieldText={(event) => setFieldText(event, "password")}
      />
      <PasswordTextField
        confirm={true}
        setFieldText={(event) => setFieldText(event, "confirmPassword")}
      />
      <SubmitButton
        handleOnClick={handleOnSubmit}
        isEnable={submitButtonEnable}
      />
      <LinkToLogin
        handleCloseDialog={handleCloseDialog}
        handleOpenLoginBox={handleOpenLoginBox}
      />
    </DialogContent>
  );
}

export default function SignupDialog({
  open,
  handleClose,
  handleOpenLoginBox,
}) {
  const dispatch = useDispatch();
  const initialFormData = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = React.useState(initialFormData);
  const [submitButtonEnable, setSubmitButtonEnable] = React.useState(false);
  const [openSuccessfulAlert, setOpenSuccessfulAlert] = React.useState(false);
  const [textErrorAlert, setTextErrorAlert] = React.useState(null);
  const [openErrorAlert, setOpenErrorAlert] = React.useState(false);

  const handleCloseBox = () => {
    handleClose();
    setFormData(initialFormData);
    setSubmitButtonEnable(false);
    setTextErrorAlert(null);
    setOpenErrorAlert(false);
  };
  const checkNoEmptyField = (data) => {
    return Object.keys(data).every((key) => data[key].trim() !== "");
  };
  const setFieldText = (event, fieldName) => {
    const newFormData = {
      ...formData,
      [fieldName]: event.target.value,
    };
    setFormData(newFormData);
    setSubmitButtonEnable(checkNoEmptyField(newFormData));
  };
  const handleOnSubmit = async () => {
    const { error, msg } = validateSignupForm(formData);
    if (!error) {
      const response = await dispatch(signup(formData));
      if (!response.payload.error) {
        handleCloseBox();
        setOpenSuccessfulAlert(true);
        handleOpenLoginBox();
      } else {
        setTextErrorAlert(response.payload.data[0]);
        setOpenErrorAlert(true);
      }
    } else {
      setTextErrorAlert(msg);
      setOpenErrorAlert(true);
    }
  };
  const handlePressEnter = (event) => {
    if (event.key == "Enter" && submitButtonEnable) handleOnSubmit();
  };

  return (
    <React.StrictMode>
      <Dialog
        scroll="paper"
        maxWidth="xs"
        fullWidth={true}
        open={open}
        onClose={handleCloseBox}
        onKeyDown={handlePressEnter}
        id="__next"
      >
        <Title handleCloseDialog={handleCloseBox} />
        <Content
          data={formData}
          submitButtonEnable={submitButtonEnable}
          setFieldText={setFieldText}
          handleOnSubmit={handleOnSubmit}
          handleCloseDialog={handleCloseBox}
          handleOpenLoginBox={handleOpenLoginBox}
        />
      </Dialog>
      <Alert
        open={openErrorAlert}
        setOpen={setOpenErrorAlert}
        text={textErrorAlert}
        mode="error"
      />
      <Alert
        open={openSuccessfulAlert}
        setOpen={setOpenSuccessfulAlert}
        text={messages.successfulSignup}
        mode="success"
      />
    </React.StrictMode>
  );
}
