import * as React from "react";
import { useDispatch } from "react-redux";
import SetListPage from "src/components/list/setList";
import withAuth from "src/components/auth/withAuth";
import { listsActions } from "src/_store";

export default withAuth(function NewListPage({ className }) {
  const dispatch = useDispatch();

  const data = {
    title: "",
    description: "",
    header: null,
  };
  const handleOnSave = async (dataToSave) => {
    return await dispatch(listsActions.created(dataToSave));
  };

  return <SetListPage data={data} handleOnSave={handleOnSave} />;
});
