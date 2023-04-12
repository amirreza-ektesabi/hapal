import * as React from "react";
import { useDispatch } from "react-redux";
import SetListPage from "src/components/list/setPage";
import AuthContext from "src/components/auth/authContext";
import { listsActions } from "src/_store";
import { pageTitle } from "src/_helpers";

export default function NewListPage({ className }) {
  const { isAuthenticated, openLoginBox } = React.useContext(AuthContext);
  const dispatch = useDispatch();

  const data = {
    title: "",
    description: "",
    header: null,
  };
  const handleOnSave = async (dataToSave) => {
    return await dispatch(listsActions.created(dataToSave));
  };

  React.useEffect(() => {
    document.title = pageTitle("Make new List");
    if (!isAuthenticated) openLoginBox();
  }, []);

  return <SetListPage data={data} handleOnSave={handleOnSave} />;
}
