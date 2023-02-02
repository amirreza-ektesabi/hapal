import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import InputAdornment from "@mui/material/InputAdornment";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ListItems from "src/components/listItems";
import { selectPropertyByPuuid } from "src/general/reducers/properties";

function SetPair({ data, className }) {
  return (
    <Box className={className + " space-y-1"}>
      <TextField
        defaultValue={data.key}
        variant="standard"
        className="w-full"
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <DeleteRoundedIcon className="text-xl cursor-pointer hover:text-greyZ mx-1" />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        multiline
        defaultValue={data.value}
        variant="outlined"
        className="w-full"
        maxRows={3}
      />
    </Box>
  );
}

function PairList({ data, className }) {
  return (
    <ListItems
      data={data.pairs}
      itemKey="data"
      component={SetPair}
      includeDivider={false}
      className="space-y-6"
    />
  );
}

function Title({ title, data, className, handleClose }) {
  return (
    <DialogTitle className="flex">
      {title}
      <IconButton onClick={handleClose} className="ml-auto mr-1">
        <CloseRoundedIcon className="fill-greyZ" />
      </IconButton>
    </DialogTitle>
  );
}

function Content({ data, className }) {
  return (
    <DialogContent
      dividers={true}
      className="w-full flex flex-col place-items-center space-y-10"
    >
      <TextField
        label="Name"
        defaultValue={data.key}
        variant="standard"
        className="w-full"
      />
      <PairList data={data} />
    </DialogContent>
  );
}

function Actions({ data, className, handleClose }) {
  return (
    <DialogActions>
      <Button className="mr-auto ml-2">Add Pair</Button>
      <Button onClick={handleClose} className="ml-auto mr-2">
        Save
      </Button>
    </DialogActions>
  );
}

export default function EditPropertyBox({
  puuid,
  className,
  open,
  handleClose,
}) {
  const data = useSelector((state) => selectPropertyByPuuid(state, puuid));

  return (
    <React.StrictMode>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        maxWidth="sm"
        fullWidth={true}
        sx={{ "& .MuiDialog-paper": { height: "70%" } }}
      >
        <Title title="New Property" handleClose={handleClose} />
        <Content data={data} />
        <Actions data={data} handleClose={handleClose} />
      </Dialog>
    </React.StrictMode>
  );
}
