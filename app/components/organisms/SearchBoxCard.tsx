import { useState } from "react";
import Card from "../atoms/Card";
import SearchBox from "../molecules/SearchBox";
import { useGet } from "@/app/hooks/useGet";
import { ENDPOINTS } from "@/app/constants/endpointConstants";
import { StockSearchResponse } from "@/app/api-interface/stockList";

export const SearchBoxCard = () => {
  const [searchText, setSearchText] = useState("");

  const { data: candidates, isLoading, refetch } = useGet<StockSearchResponse[]>(
    { url: ENDPOINTS.STOCKS_SEARCH, query: searchText, shouldFetch: false }
  );

  const handleSelectCandidate = (c: StockSearchResponse) => {
    setSearchText("");
  };

  return (
    <Card>
      <SearchBox
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={refetch}
        candidates={candidates}
        onSelectCandidate={handleSelectCandidate}
      />
      <div style={{ color: "#888", fontSize: 15, marginTop: 8 }}>
        検索結果から銘柄をクリックして追加できます
      </div>
    </Card>
  );
};
