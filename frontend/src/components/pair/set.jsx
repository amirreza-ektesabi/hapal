import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function SetPair({ data, className, handleRemove, setField }) {
  return (
    <Box className={className + " space-y-1"}>
      <TextField
        onChange={(event) => setField(data.index, "key", event.target.value)}
        value={data.key}
        variant="standard"
        className="w-full"
        inputProps={{ maxLength: 50 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <DeleteRoundedIcon
                onClick={() => handleRemove(data.index)}
                className="text-xl cursor-pointer hover:text-greyZ mx-1"
                titleAccess="Delete Pair"
              />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        multiline
        value={data.value}
        inputProps={{ maxLength: 1023 }}
        onChange={(event) => setField(data.index, "value", event.target.value)}
        variant="outlined"
        className="w-full"
        maxRows={3}
      />
    </Box>
  );
}
