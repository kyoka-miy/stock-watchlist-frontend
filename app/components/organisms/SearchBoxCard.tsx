import { useState } from "react";
import Card from "../atoms/Card";
import SearchBox from "../molecules/SearchBox";
import { useGet } from "@/app/hooks/useGet";
import { ENDPOINTS } from "@/app/constants/endpointConstants";
import { StockSearchCandidate } from "@/app/api-interface/stock";
import { usePost } from "@/app/hooks/usePost";

type Props = {
  selectedListId?: number;
  onAdded?: () => void;
};

export const SearchBoxCard = ({ selectedListId, onAdded }: Props) => {
  const [searchText, setSearchText] = useState("");

  const {
    data: candidates,
    isLoading,
    refetch,
  } = useGet<StockSearchCandidate[]>({
    url: ENDPOINTS.STOCKS_SEARCH,
    query: searchText,
    shouldFetch: false,
  });

  const { post } = usePost(
    selectedListId ? ENDPOINTS.STOCK_LIST_STOCKS(selectedListId) : "",
  );

  const handleSelectCandidate = (c: StockSearchCandidate) => {
    if (!selectedListId) return;
    post({ symbols: [c.symbol] }).then((res) => {
      if (res) {
        onAdded?.();
      }
    });
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
        isLoading={isLoading}
      />
      <div style={{ color: "#888", fontSize: 15, marginTop: 8 }}>
        検索結果から銘柄をクリックして追加できます
      </div>
    </Card>
  );
};
