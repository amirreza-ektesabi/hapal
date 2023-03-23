import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import theme from "src/general/theme";

export default function ReplyBox({
  textInputBody,
  replyButtonIsEnable,
  handleTextInputChange,
  handleClickOnReplyButton,
  className,
}) {
  return (
    <Box className="px-4 space-y-1">
      <TextField
        multiline
        variant="outlined"
        className="w-full"
        onChange={handleTextInputChange}
        inputProps={{ maxLength: 512 }}
        InputProps={{ className: "text-sm items-end" }}
        value={textInputBody}
      />
      <Box className="flex">
        <Button
          variant="contained"
          size="small"
          className="rounded-full px-4 ml-auto"
          children="Reply"
          disabled={!replyButtonIsEnable}
          style={{
            background: replyButtonIsEnable ? theme.palette.blueZ : "grey",
          }}
          onClick={handleClickOnReplyButton}
        />
      </Box>
    </Box>
  );
}
