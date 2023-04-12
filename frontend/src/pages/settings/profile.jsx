import * as React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SaveButton from "src/components/objectRelated/saveButton";
import withAuth from "src/components/auth/withAuth";
import AutoFocusTextField from "src/components/autoFocusTextField";
import AuthContext from "src/components/auth/authContext";
import { HeaderEdit } from "src/components/objectRelated/header";
import { authActions } from "src/_store";
import { pageTitle, stringFormat } from "src/_helpers";
import urls from "src/general/urls";

function Top({ data, className }) {
  return (
    <Box className={className}>
      <Box className="max-w-lg w-full">
        <HeaderEdit
          data={data}
          colorDecider={data.bio}
          includeProfileAvatar={true}
        />
      </Box>
    </Box>
  );
}

function InputFields({ data, setName, setBio, className }) {
  return (
    <Box className={className}>
      <AutoFocusTextField
        label="Name"
        value={data.name}
        onChange={setName}
        inputProps={{ maxLength: 50 }}
        variant="standard"
        className="w-full"
      />
      <TextField
        multiline
        label="Bio"
        value={data.bio}
        onChange={setBio}
        inputProps={{ maxLength: 140 }}
        variant="standard"
        className="w-full"
      />
    </Box>
  );
}

export default withAuth(function EditProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = React.useContext(AuthContext);
  const [formData, setFormData] = React.useState(currentUser);

  React.useEffect(() => {
    document.title = pageTitle("Edit profile");
  }, []);

  const setName = (event) => {
    setFormData({
      ...formData,
      name: event.target.value,
    });
  };
  const setBio = (event) => {
    setFormData({
      ...formData,
      bio: event.target.value,
    });
  };
  const handleOnClickSaveButton = async () => {
    const dataToSave = {
      name: formData.name,
      bio: formData.bio,
    };
    await dispatch(authActions.editProfile(dataToSave));
    const redirectUrl = stringFormat(urls.user, currentUser.username);
    router.push(redirectUrl);
  };

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full space-y-16">
        <Top
          data={formData}
          className="flex justify-center place-items-center"
        />
        <Box className="space-y-10">
          <InputFields
            data={formData}
            setName={setName}
            setBio={setBio}
            className="px-4 space-y-10"
          />
          <SaveButton isEnable={true} handleOnClick={handleOnClickSaveButton} />
        </Box>
      </Box>
    </Box>
  );
});
