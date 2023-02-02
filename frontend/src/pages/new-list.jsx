import * as React from "react";
import SetListPage from "src/components/list/setList";

export default function NewListPage({ className }) {
  const data = {
    title: "",
    description: "",
    header: null,
  };

  return <SetListPage data={data} />;
}
