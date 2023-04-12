import * as React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SaveButton from "src/components/objectRelated/saveButton";
import HeaderImage from "src/components/objectRelated/headerImage";
import { PropertyEditList } from "src/components/post/propertyList";
import AutoFocusTextField from "src/components/autoFocusTextField";
import HeaderIcons from "src/components/objectRelated/headerIcons";
import SetPropertyBox from "src/components/property/setBox";
import { stringFormat } from "src/_helpers";
import urls from "src/general/urls";

function Top({ data, className }) {
  return (
    <Box className="relative">
      <HeaderImage
        data={data}
        colorDecider={data.title}
        height={5}
        className={className}
        forEdit={true}
      />
      <HeaderIcons
        data={data}
        includeMoreIcon={false}
        includeShareIcon={false}
        className="absolute top-4 space-x-3 px-4"
      />
    </Box>
  );
}

function InputFields({
  data,
  className,
  setTitle,
  handleRemoveProperty,
  handleEditProperty,
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
      <PropertyEditList
        data={data.properties}
        handleRemove={handleRemoveProperty}
        handleEdit={handleEditProperty}
      />
    </Box>
  );
}

function AddPropertyButton({ className, handleOnClick }) {
  return (
    <Button
      variant="contained"
      className="px-7 mr-auto rounded-full h-10 font-bold bg-blueZ"
      children="Add Property"
      onClick={handleOnClick}
    />
  );
}

function Buttons({
  className,
  handleOnClickSaveButton,
  handleOnClickAddNewProperty,
}) {
  return (
    <Box className={className + " flex"}>
      <AddPropertyButton handleOnClick={handleOnClickAddNewProperty} />
      <SaveButton isEnable={true} handleOnClick={handleOnClickSaveButton} />
    </Box>
  );
}

export default function SetPostPage({ data, handleOnSave, className }) {
  const router = useRouter();
  const [formData, setFormData] = React.useState(data);
  const endRef = React.useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [openAddPropertyBox, setOpenAddPropertyBox] = React.useState(false);
  const handleOpenAddPropertyBox = () => setOpenAddPropertyBox(true);
  const handleCloseAddPropertyBox = () => setOpenAddPropertyBox(false);

  const handleAddProperty = (newPropertyData) => {
    const newProperty = {
      ...newPropertyData,
      index: formData.properties.length,
    };
    setFormData({
      ...formData,
      properties: [...formData.properties, newProperty],
    });
    scrollToBottom();
  };
  const handleRemoveProperty = (index) => {
    setFormData({
      ...formData,
      properties: formData.properties
        .filter((property) => index !== property.index)
        .map((property) => ({
          ...property,
          index: property.index - (property.index > index ? 1 : 0),
        })),
    });
  };
  const handleEditProperty = (editedData) => {
    setFormData({
      ...formData,
      properties: formData.properties.map((property) =>
        property.index === editedData.index ? editedData : property
      ),
    });
  };
  const setTitle = (event) => {
    setFormData({
      ...formData,
      title: event.target.value,
    });
  };
  const handleOnClickSaveButton = async () => {
    const dataToSave = {
      ...formData,
      properties: formData.properties.map((propertyData) => ({
        key: propertyData.key,
        pairs: propertyData.pairs,
      })),
    };
    const response = await handleOnSave(dataToSave);
    const uuid = response.payload.uuid;
    const redirectUrl = stringFormat(urls.post, uuid);
    router.push(redirectUrl);
  };

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full space-y-16">
        <Top data={formData} />
        <InputFields
          data={formData}
          className="px-4 space-y-16"
          setTitle={setTitle}
          handleRemoveProperty={handleRemoveProperty}
          handleEditProperty={handleEditProperty}
        />
        <Buttons
          className="px-4"
          handleOnClickSaveButton={handleOnClickSaveButton}
          handleOnClickAddNewProperty={handleOpenAddPropertyBox}
        />
      </Box>
      <SetPropertyBox
        open={openAddPropertyBox}
        handleClose={handleCloseAddPropertyBox}
        handleSave={handleAddProperty}
        action="add"
      />
      <div ref={endRef} className="mb-20" />
    </Box>
  );
}
