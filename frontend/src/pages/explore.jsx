import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { listsActions, listsSelectors } from "src/_store";
import { pageTitle, useSwrNoFocus } from "src/_helpers";
import { getExploreLists } from "api";
import Loading from "src/components/loading";
import ListItems from "src/components/listItems";
import ListPreview from "src/components/list/preview";

function Lists({ className }) {
  const dispatch = useDispatch();

  let uuids = useSelector((state) =>
    listsSelectors.selectExploreUuids(state, {})
  );

  const swrKey = "explore";
  const swrFetcher = () => getExploreLists();
  const { data: response, isLoading } = useSwrNoFocus(swrKey, swrFetcher);
  const isError = response && response.error;

  React.useEffect(() => {
    if (!isLoading && !isError)
      dispatch(
        listsActions.retrievedList({
          list: response.data.map((obj) => ({ explore: true, ...obj })),
        })
      );
  }, [response]);

  return (
    <React.StrictMode>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        ""
      ) : (
        <ListItems
          data={uuids}
          itemKey="uuid"
          component={ListPreview}
          itemComponentClassName="mx-4"
        />
      )}
    </React.StrictMode>
  );
}

export default function ExplorePage() {
  React.useEffect(() => {
    document.title = pageTitle("Explore");
  }, []);

  return (
    <Box className="flex flex-col place-items-center">
      <Box className="max-w-lg w-full mt-3 mb-[3.5rem] sm:mb-[3rem]">
        <Lists />
      </Box>
    </Box>
  );
}
