import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SaveButton from "src/components/objectRelated/saveButton";
import HeaderImage from "src/components/objectRelated/headerImage";
import { PropertyEditList } from "src/components/post/propertyList";

function Top({ data, className }) {
  return (
    <HeaderImage
      data={data}
      colorDecider={data.title}
      height="20"
      className={className}
    />
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
      <TextField
        label="Title"
        value={data.title}
        onChange={setTitle}
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

function AddPropertyButton({ className, handleAddNewProperty }) {
  return (
    <Button
      variant="contained"
      className="px-7 mr-auto rounded-full h-10 font-bold bg-blueZ"
      children="Add Property"
      onClick={handleAddNewProperty}
    />
  );
}

function Buttons({ data, className, handleAddNewProperty }) {
  return (
    <Box className={className + " flex"}>
      <AddPropertyButton handleAddNewProperty={handleAddNewProperty} />
      <SaveButton isEnable={true} />
    </Box>
  );
}

export default function SetPostPage({ data, className }) {
  const [formData, setFormData] = React.useState(data);
  const endRef = React.useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddNewProperty = () => {
    const newProperty = {
      key: "Untitled",
      pairs: [],
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

  return (
    <Box className="flex flex-col place-items-center mb-6">
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
          data={formData}
          className="px-4"
          handleAddNewProperty={handleAddNewProperty}
        />
      </Box>
      <div ref={endRef} />
    </Box>
  );
}
