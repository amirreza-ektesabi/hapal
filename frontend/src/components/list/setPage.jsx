import * as React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SaveButton from "src/components/objectRelated/saveButton";
import AutoFocusTextField from "src/components/autoFocusTextField";
import { HeaderEdit } from "src/components/objectRelated/header";
import AuthContext from "src/components/auth/authContext";
import { stringFormat } from "src/_helpers";
import urls from "src/general/urls";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function Top({ data, className }) {
  return (
    <Box className={className}>
      <Box className="max-w-lg w-full">
        <HeaderEdit data={data} colorDecider={data.title} />
      </Box>
    </Box>
  );
}

function InputFields({
  data,
  className,
  setTitle,
  setDescription,
  setWhoCanAddPost,
}) {
  return (
    <Box className={className}>
      <AutoFocusTextField
        label="Title"
        value={data.title}
        onChange={setTitle}
        inputProps={{ maxLength: 255 }}
        variant="standard"
        className="w-full"
      />
      <TextField
        multiline
        label="Description"
        value={data.description}
        onChange={setDescription}
        inputProps={{ maxLength: 500 }}
        variant="standard"
        className="w-full"
      />
      <FormControl variant="standard" className="w-full">
        <InputLabel>Who can add post</InputLabel>
        <Select
          label="Who can add post"
          value={data.who_can_add_post}
          onChange={setWhoCanAddPost}
        >
          <MenuItem value={1}>Just me</MenuItem>
          <MenuItem value={2}>Everyone</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default function SetListPage({ data, handleOnSave, className }) {
  const router = useRouter();

  const { isAuthenticated } = React.useContext(AuthContext);

  const initialData = {
    title: data.title,
    description: data.description,
    who_can_add_post: data.who_can_add_post,
  };
  const [formData, setFormData] = React.useState(initialData);

  React.useEffect(() => {
    setFormData(data);
  }, [data]);

  const setTitle = (event) => {
    setFormData({
      ...formData,
      title: event.target.value,
    });
  };
  const setDescription = (event) => {
    setFormData({
      ...formData,
      description: event.target.value,
    });
  };
  const setWhoCanAddPost = (event) => {
    setFormData({
      ...formData,
      who_can_add_post: event.target.value,
    });
  };
  const handleOnClickSaveButton = async () => {
    const dataToSave = {
      title: formData.title,
      description: formData.description,
      who_can_add_post: formData.who_can_add_post,
    };
    const response = await handleOnSave(dataToSave);
    const uuid = response.payload.uuid;
    const redirectUrl = stringFormat(urls.list, uuid);
    router.push(redirectUrl);
  };

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full space-y-16">
        <Top
          data={formData}
          className="flex justify-center place-items-center"
        />
        <InputFields
          data={formData}
          className="px-4 space-y-10"
          setTitle={setTitle}
          setDescription={setDescription}
          setWhoCanAddPost={setWhoCanAddPost}
        />
        <SaveButton
          isEnable={isAuthenticated}
          className="px-4"
          handleOnClick={handleOnClickSaveButton}
        />
      </Box>
    </Box>
  );
}
