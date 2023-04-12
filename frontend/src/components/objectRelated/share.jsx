import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircleIcon from "src/components/circleIcon";
import Alert from "src/components/alert";
import {
  RedditLogo,
  TelegramLogo,
  TwitterLogo,
} from "src/components/socialMediaLogos";
import { stringFormat } from "src/_helpers";
import messages from "src/general/messages";
import urls from "src/general/urls";
import Link from "next/link";

const shareToSocialItems = [
  {
    logoComponent: TelegramLogo,
    shareUrl: "https://telegram.me/share/url?url={0}",
  },
  {
    logoComponent: RedditLogo,
    shareUrl: "https://www.reddit.com/submit?url={0}",
  },
  {
    logoComponent: TwitterLogo,
    shareUrl: "https://twitter.com/share?url={0}",
  },
];

function ShareIcon({ className, button, handleClick }) {
  return (
    <React.StrictMode>
      {button ? (
        <CircleIcon onClick={handleClick} className={className}>
          <ShareRoundedIcon
            color="white"
            className="pr-0.5"
            titleAccess="Share"
          />
        </CircleIcon>
      ) : (
        <ShareRoundedIcon
          className={className + " text-xl cursor-pointer hover:fill-greyZ"}
          onClick={handleClick}
          titleAccess="Share"
        />
      )}
    </React.StrictMode>
  );
}

function Logos({ link }) {
  return (
    <Box className="flex space-x-3">
      {shareToSocialItems.map((item, index) => (
        <Link
          href={stringFormat(item.shareUrl, link)}
          target="_blank"
          key={index}
        >
          <item.logoComponent width="50px" />
        </Link>
      ))}
    </Box>
  );
}

function Title({ handleClose }) {
  return (
    <DialogTitle className="flex">
      {"Share"}
      <IconButton onClick={handleClose} className="ml-auto -mt-1">
        <CloseRoundedIcon className="fill-greyZ" titleAccess="Close" />
      </IconButton>
    </DialogTitle>
  );
}

function CopyLink({ link }) {
  const inputRef = React.useRef();
  const [openAlert, setOpenAlert] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    inputRef.current.select();
    setOpenAlert(true);
  };

  return (
    <React.StrictMode>
      <TextField
        variant="outlined"
        size="small"
        value={link}
        className="w-full"
        inputRef={inputRef}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="contained"
                className="bg-blueZ rounded-full font-medium text-xs"
                children="Copy"
              />
            </InputAdornment>
          ),
        }}
        onClick={copyToClipboard}
      />
      <Alert
        open={openAlert}
        setOpen={setOpenAlert}
        text={messages.linkCopied}
        mode="success"
      />
    </React.StrictMode>
  );
}

function SocialDialog({ data, open, handleClose }) {
  const path =
    data.type === "account"
      ? stringFormat(urls.user, data.username)
      : data.type === "list"
      ? stringFormat(urls.list, data.uuid)
      : data.type === "post"
      ? stringFormat(urls.post, data.uuid)
      : "";
  const link = window.location.origin + path;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth={true}
      open={open}
      onClose={handleClose}
      id="__next"
    >
      <Title handleClose={handleClose} />
      <DialogContent className="space-y-5">
        <Logos link={link} />
        <CopyLink link={link} />
      </DialogContent>
    </Dialog>
  );
}

export default function Share({ data, button = false, className }) {
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleOnClick = () => handleOpenDialog();

  return (
    <React.StrictMode>
      <ShareIcon
        button={button}
        className={className}
        handleClick={handleOnClick}
      />
      <SocialDialog
        data={data}
        open={openDialog}
        handleClose={handleCloseDialog}
      />
    </React.StrictMode>
  );
}
