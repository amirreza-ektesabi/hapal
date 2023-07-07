import * as React from "react";
import { useDispatch } from "react-redux";
import SetListPage from "src/components/list/setPage";
import AuthContext from "src/components/auth/authContext";
import { AlertContext } from "src/components/alert";
import { listsActions } from "src/_store";
import { pageTitle, stringFormat, truncate } from "src/_helpers";
import messages from "src/general/messages";

export default function NewListPage({ className }) {
  const { isAuthenticated, openLoginBox } = React.useContext(AuthContext);
  const { setAlert } = React.useContext(AlertContext);
  const dispatch = useDispatch();

  const data = {
    title: "",
    description: "",
    who_can_add_post: 1,
    header: null,
  };
  const handleOnSave = async (dataToSave) => {
    setAlert(
      stringFormat(messages.listCreated, truncate(dataToSave.title, 20)),
      "success"
    );
    return await dispatch(listsActions.created(dataToSave));
  };

  React.useEffect(() => {
    document.title = pageTitle("Make new List");
    if (!isAuthenticated) openLoginBox();
  }, []);

  return <SetListPage data={data} handleOnSave={handleOnSave} />;
}
