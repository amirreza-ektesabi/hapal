import * as React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DisposableButton, {
  DisposableButtonFalied,
} from "src/components/disposableButton";
import AutoFocusTextField from "src/components/autoFocusTextField";
import PasswordTextField from "src/components/auth/passwordTextField";
import ArrowTooltip from "src/components/arrowTooltip";
import { AlertContext } from "src/components/alert";
import theme from "src/general/theme";
import messages from "src/general/messages";
import { authActions } from "src/_store";
import { validateSignupForm } from "src/_helpers/validators";

function UsernameTextField({ className, ...props }) {
  return (
    <AutoFocusTextField
      label="Username"
      variant="outlined"
      margin="dense"
      inputProps={{
        autoCapitalize: "none",
      }}
      className={className + " w-full rounded-md"}
      {...props}
    />
  );
}

function EmailTextField({ className, ...props }) {
  return (
    <TextField
      label="Email"
      variant="outlined"
      margin="dense"
      inputProps={{
        autoCapitalize: "none",
      }}
      className={className + " w-full rounded-md"}
      {...props}
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
        <ArrowTooltip title="Close">
          <CloseRoundedIcon className="fill-greyZ" />
        </ArrowTooltip>
      </IconButton>
    </DialogTitle>
  );
}

function Content({
  inputRefs,
  handleOnChange,
  handleOnSubmit,
  handleCloseDialog,
  handleOpenLoginBox,
  submitButtonEnable,
}) {
  return (
    <DialogContent className="my-4 flex flex-col place-items-center space-y-6">
      <UsernameTextField
        inputRef={inputRefs.username}
        onChange={handleOnChange}
      />
      <EmailTextField inputRef={inputRefs.email} onChange={handleOnChange} />
      <PasswordTextField
        inputRef={inputRefs.password}
        onChange={handleOnChange}
      />
      <PasswordTextField
        confirm={true}
        inputRef={inputRefs.confirmPassword}
        onChange={handleOnChange}
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
  const router = useRouter();
  const dispatch = useDispatch();

  const { setAlert } = React.useContext(AlertContext);

  const fieldNames = ["username", "email", "password", "confirmPassword"];
  const inputRefs = Object.fromEntries(
    fieldNames.map((key) => [key, React.useRef()])
  );
  const [submitButtonEnable, setSubmitButtonEnable] = React.useState(false);

  const handleCloseBox = () => {
    handleClose();
    setSubmitButtonEnable(false);
  };
  const getFormData = () => {
    return Object.fromEntries(
      fieldNames.map((key) => [key, inputRefs[key].current.value])
    );
  };
  const checkNoEmptyField = (data) => {
    return Object.keys(data).every((key) => data[key].trim() !== "");
  };
  const handleOnChange = () => {
    const formData = getFormData();
    setSubmitButtonEnable(checkNoEmptyField(formData));
  };
  const handleOnSuccessfulSubmit = async (formData) => {
    const response = await dispatch(authActions.login(formData));
    if (!response.payload.error) {
      await dispatch(authActions.getMe());
      handleCloseBox();
      setAlert(messages.successfulSignup, "success");
      router.reload();
    }
  };
  const handleOnUnsuccessfulSubmit = (errorMessage) => {
    setAlert(errorMessage, "error", true);
    return DisposableButtonFalied;
  };
  const handleOnSubmit = async () => {
    const formData = getFormData();
    const { error, msg } = validateSignupForm(formData);
    if (!error) {
      const response = await dispatch(authActions.signup(formData));
      if (!response.payload.error) {
        await handleOnSuccessfulSubmit(formData);
      } else {
        return handleOnUnsuccessfulSubmit(response.payload.data[0]);
      }
    } else {
      return handleOnUnsuccessfulSubmit(msg);
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
          inputRefs={inputRefs}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          handleCloseDialog={handleCloseBox}
          handleOpenLoginBox={handleOpenLoginBox}
          submitButtonEnable={submitButtonEnable}
        />
      </Dialog>
    </React.StrictMode>
  );
}
