import * as React from "react";
import Search from "../components/search/Search";
import DefaultLayout from "../layouts/DefaultLayout";

const SearchResults: React.FC<any> = () => {
  if (typeof window !== "object") {
    return <></>;
  }

  const url = new URL(window.location.href);
  const searchVal = url.searchParams.get("term");

  return (
    <DefaultLayout title={`Search for "${searchVal}"`}>
      <Search searchVal={searchVal} />
    </DefaultLayout>
  );
};

export default SearchResults;
