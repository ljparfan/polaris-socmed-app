import { Link } from "react-router-dom";
import { XIcon } from "@heroicons/react/solid";
import Avatar from "./Avatar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectSearchProfilesData,
  selectSearchProfilesLoading,
  selectSearchProfilesPagination,
  selectShowLoadMoreProfilesToSearch,
  selectShowNoResults,
} from "../redux/profile/profile.selectors";
import {
  hideFullSizeSearchbox,
  hideSearchResultsPanel,
} from "../redux/general/general.actions";
import Button from "./Button";
import { searchProfilesStart } from "../redux/profile/profile.actions";

type Props = {
  clearSearchQuery: () => void;
  query: string;
};

const SearchResultsPanel = ({ clearSearchQuery, query }: Props) => {
  const profiles = useAppSelector(selectSearchProfilesData);
  const showLoadMore = useAppSelector(selectShowLoadMoreProfilesToSearch);
  const showNoResults = useAppSelector(selectShowNoResults);
  const loading = useAppSelector(selectSearchProfilesLoading);
  const pagination = useAppSelector(selectSearchProfilesPagination);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white dark:border-neutral-700 dark:border dark:bg-neutral-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div className="text-base font-medium text-gray-500 dark:text-neutral-400 px-5 pt-2 flex justify-between items-center">
        <span>Results</span>
        <button
          className="hover:bg-gray-50 rounded-full p-2 dark:hover:bg-neutral-700"
          onClick={() => dispatch(hideSearchResultsPanel())}
        >
          <XIcon className="h-5" />
        </button>
      </div>
      {showNoResults && (
        <div className="flex justify-center text-base font-medium text-gray-900 dark:text-neutral-400">
          No results found.
        </div>
      )}
      <div className="py-5 px-5 max-h-80 overflow-auto">
        {profiles.map((profile) => (
          <Link
            key={profile.id}
            to={`/${profile.username}`}
            onClick={() => {
              dispatch(hideSearchResultsPanel());
              clearSearchQuery();
              dispatch(hideFullSizeSearchbox());
            }}
            className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700"
          >
            <Avatar user={profile} />
            <div className="ml-4">
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {profile.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-white">
                @{profile.username}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {showLoadMore && (
        <div className="flex justify-center pb-2">
          <Button
            loading={loading}
            onClick={() => {
              dispatch(
                searchProfilesStart({
                  keyword: query,
                  pagination: { pageNumber: pagination.page + 1, pageSize: 5 },
                })
              );
            }}
            className="rounded-2xl text-base font-medium text-gray-900 shadow-none hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            Show more
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPanel;
