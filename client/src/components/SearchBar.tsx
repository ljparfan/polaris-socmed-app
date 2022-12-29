import { Popover } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import useInput from "../hooks/useInput";
import {
  hideSearchResultsPanel,
  showSearchResultsPanel,
} from "../redux/general/general.actions";
import { selectSearchPanelVisibility } from "../redux/general/general.selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { searchProfilesStart } from "../redux/profile/profile.actions";
import SearchResultsPanel from "./SearchResultsPanel";

const SearchBar = () => {
  const [query, handleQueryChange, clearValue] = useInput("");
  const dispatch = useAppDispatch();
  const searchPanelResultsVisible = useAppSelector(selectSearchPanelVisibility);
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(showSearchResultsPanel());
      dispatch(
        searchProfilesStart({
          keyword: debouncedQuery,
          pagination: { pageNumber: 1, pageSize: 5 },
        })
      );
    } else {
      dispatch(hideSearchResultsPanel());
    }
  }, [debouncedQuery, dispatch]);

  return (
    <Popover.Group as="nav" className="lg:w-4/12 ">
      <Popover className="flex flex-col">
        {() => (
          <>
            <div className="flex items-center rounded-full bg-gray-100 dark:bg-neutral-700 my-5 p-2">
              <SearchIcon className="h-6 hidden md:block text-gray-600 dark:text-neutral-400 mr-1" />
              <input
                className="w-full md:inline-flex items-center outline-none flex-shrink textInput"
                type="text"
                placeholder="Search..."
                onClick={() => {
                  if (debouncedQuery && !searchPanelResultsVisible) {
                    dispatch(showSearchResultsPanel());
                  }
                }}
                value={query}
                onChange={handleQueryChange}
              />
            </div>
            {searchPanelResultsVisible && (
              <Popover.Panel
                static
                className="absolute z-10 -ml-10 mt-16 w-full md:max-w-md md:rounded-full"
              >
                <SearchResultsPanel
                  query={debouncedQuery}
                  clearSearchQuery={clearValue}
                />
              </Popover.Panel>
            )}
          </>
        )}
      </Popover>
    </Popover.Group>
  );
};

export default SearchBar;
