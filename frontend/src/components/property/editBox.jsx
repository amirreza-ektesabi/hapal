import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ListItems from "src/components/listItems";
import SetPair from "src/components/objectRelated/pair/set";
import AutoFocusTextField from "src/components/autoFocusTextField";

function PairList({ data, className, handleRemovePair, setPairField }) {
  return (
    <ListItems
      data={data.pairs}
      itemKey="data"
      component={SetPair}
      includeDivider={false}
      className="space-y-6"
      handleRemove={handleRemovePair}
      setField={setPairField}
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

function Content({
  data,
  className,
  handleRemovePair,
  setPairField,
  setKeyField,
}) {
  return (
    <DialogContent
      dividers={true}
      className="w-full flex flex-col place-items-center space-y-10"
    >
      <AutoFocusTextField
        label="Name"
        value={data.key}
        onChange={setKeyField}
        variant="standard"
        className="w-full"
      />
      <PairList
        data={data}
        handleRemovePair={handleRemovePair}
        setPairField={setPairField}
      />
    </DialogContent>
  );
}

function Actions({ handleSave, handleAddNewPair, className }) {
  return (
    <DialogActions>
      <Button onClick={handleAddNewPair} className="mr-auto ml-2">
        Add Pair
      </Button>
      <Button onClick={handleSave} className="ml-auto mr-2">
        Save
      </Button>
    </DialogActions>
  );
}

export default function EditPropertyBox({
  data,
  className,
  open,
  handleClose,
  handleSave,
}) {
  const initialData = {
    ...data,
    pairs: data.pairs.map((pair, index) => ({ ...pair, index: index })),
  };
  const [boxData, setBoxData] = React.useState(initialData);

  const handleAddNewPair = () => {
    const newPair = {
      key: "",
      value: "",
      index: boxData.pairs.length,
    };
    setBoxData({
      ...boxData,
      pairs: [...boxData.pairs, newPair],
    });
  };
  const handleRemovePair = (index) => {
    setBoxData({
      ...boxData,
      pairs: boxData.pairs
        .filter((pair) => index !== pair.index)
        .map((pair) => ({
          ...pair,
          index: pair.index - (pair.index > index ? 1 : 0),
        })),
    });
  };
  const setPairField = (index, name, newValue) => {
    setBoxData({
      ...boxData,
      pairs: boxData.pairs.map((pair) => ({
        ...pair,
        [name]: pair.index === index ? newValue : pair[name],
      })),
    });
  };
  const setKeyField = (event) => {
    setBoxData({
      ...boxData,
      key: event.target.value,
    });
  };
  const handleOnClose = () => {
    handleClose();
    setBoxData(initialData);
  };
  const handleOnSave = () => {
    const dataToSave = {
      ...boxData,
      pairs: boxData.pairs.map((pairData) => ({
        key: pairData.key,
        value: pairData.value,
      })),
    };
    handleSave(dataToSave);
  };

  return (
    <React.StrictMode>
      <Dialog
        open={open}
        onClose={handleOnClose}
        scroll="paper"
        maxWidth="sm"
        fullWidth={true}
        sx={{ "& .MuiDialog-paper": { height: "70%" } }}
        id="__next"
      >
        <Title title="Edit Property" handleClose={handleOnClose} />
        <Content
          data={boxData}
          handleRemovePair={handleRemovePair}
          setPairField={setPairField}
          setKeyField={setKeyField}
        />
        <Actions
          handleSave={handleOnSave}
          handleAddNewPair={handleAddNewPair}
        />
      </Dialog>
    </React.StrictMode>
  );
}
