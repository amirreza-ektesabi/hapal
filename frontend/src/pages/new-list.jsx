import * as React from "react";
import SetListPage from "src/components/list/setList";
import withAuth from "src/components/auth/withAuth";

export default withAuth(function NewListPage({ className }) {
  const data = {
    title: "",
    description: "",
    header: null,
  };

  return <SetListPage data={data} />;
});
