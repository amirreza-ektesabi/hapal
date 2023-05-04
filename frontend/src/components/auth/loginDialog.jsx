import * as React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DisposableButton, {
  DisposableButtonFalied,
} from "src/components/disposableButton";
import AutoFocusTextField from "src/components/autoFocusTextField";
import PasswordTextField from "src/components/auth/passwordTextField";
import ArrowTooltip from "src/components/arrowTooltip";
import Alert from "src/components/alert";
import theme from "src/general/theme";
import messages from "src/general/messages";
import { authActions } from "src/_store";

function UsernameTextField({ className, setFieldText }) {
  return (
    <AutoFocusTextField
      label="Username"
      variant="outlined"
      margin="dense"
      inputProps={{
        autoCapitalize: "none",
      }}
      onChange={setFieldText}
      className={className + " w-full rounded-md"}
    />
  );
}

function SubmitButton({ className, isEnable, handleOnClick }) {
  return (
    <DisposableButton
      variant="contained"
      className={className + " w-full font-medium"}
      style={{
        background: isEnable ? "white" : "grey",
        color: theme.palette.blackZ,
      }}
      children="Log in"
      onClick={handleOnClick}
      disabled={!isEnable}
    />
  );
}

function LinkToSignup({ handleCloseDialog, handleOpenSignupBox, className }) {
  const handleOnClick = () => {
    handleCloseDialog();
    handleOpenSignupBox();
  };

  return (
    <Box className={className + " flex flex-row space-x-1"}>
      <Typography variant="body2" children="Don't have an account?" />
      <Typography
        variant="body2"
        children="Sign up"
        className="cursor-pointer text-blueZ hover:underline"
        onClick={handleOnClick}
      />
    </Box>
  );
}

function Title({ handleCloseDialog }) {
  return (
    <DialogTitle className="flex">
      {"Log in to Hapal"}
      <IconButton onClick={handleCloseDialog} className="ml-auto -mt-1">
        <ArrowTooltip title="Close">
          <CloseRoundedIcon className="fill-greyZ" />
        </ArrowTooltip>
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
  handleOpenSignupBox,
}) {
  return (
    <DialogContent className="my-4 flex flex-col place-items-center space-y-6">
      <UsernameTextField
        setFieldText={(event) => setFieldText(event, "username")}
      />
      <PasswordTextField
        setFieldText={(event) => setFieldText(event, "password")}
      />
      <SubmitButton
        handleOnClick={handleOnSubmit}
        isEnable={submitButtonEnable}
      />
      <LinkToSignup
        handleCloseDialog={handleCloseDialog}
        handleOpenSignupBox={handleOpenSignupBox}
      />
    </DialogContent>
  );
}

export default function LoginDialog({
  open,
  handleClose,
  handleOpenSignupBox,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const initialFormData = { username: "", password: "" };
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
    const response = await dispatch(authActions.login(formData));
    if (!response.payload.error) {
      await dispatch(authActions.getMe());
      handleCloseBox();
      setOpenSuccessfulAlert(true);
      router.reload();
    } else {
      setTextErrorAlert(messages.wrongDataOnLogin);
      setOpenErrorAlert(true);
      return DisposableButtonFalied;
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
          handleOpenSignupBox={handleOpenSignupBox}
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
        text={messages.successfulLogin}
        mode="success"
      />
    </React.StrictMode>
  );
}
