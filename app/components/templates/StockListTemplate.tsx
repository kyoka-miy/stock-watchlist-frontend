("use client");
import { useEffect, useState } from "react";
import Button from "../atoms/Button";
import StockList from "../organisms/StockList";
import styled from "styled-components";
import { StockListTags } from "../organisms/StockListTags";
import { StockListWithCount } from "@/app/api-interface/stockList";
import { ENDPOINTS } from "@/app/constants/endpointConstants";
import { useGet } from "@/app/hooks/useGet";
import { useDelete } from "@/app/hooks/useDelete";
import { SearchBoxCard } from "../organisms/SearchBoxCard";
import { StockInfo, StockInfoWithPage } from "@/app/api-interface/stock";
import { StockDetailModal } from "../organisms/stock-modal/StockDetailModal";
import Header from "../organisms/Header";

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7fafd;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 2.2rem 2.7rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  min-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  color: #111;
`;

export default function StockListTemplate() {
  const [stockListsWithCount, setStockListsWithCount] = useState<
    StockListWithCount[]
  >([]);
  const [selectedListId, setSelectedListId] = useState<number>();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockInfo | null>(null);

  const { data: stockListsWithCountData, refetch: refetchStockListsWithCount } =
    useGet<StockListWithCount[]>({
      url: ENDPOINTS.STOCK_LISTS_WITH_COUNT,
      shouldFetch: true,
    });

  useEffect(() => {
    if (stockListsWithCountData == null) return;

    if (stockListsWithCountData.length > 0) {
      setStockListsWithCount(stockListsWithCountData);
      setSelectedListId(stockListsWithCountData[0].id);
    } else {
      setStockListsWithCount([]);
    }
  }, [stockListsWithCountData]);

  const { data: stockInfoWithPage, refetch: refetchStocks } =
    useGet<StockInfoWithPage>({
      url: ENDPOINTS.STOCK_LIST(selectedListId ?? 0),
      shouldFetch: !!selectedListId,
    });
  useEffect(() => {
    if (selectedListId) {
      refetchStocks();
    }
  }, [selectedListId]);

  const { del: deleteListApi } = useDelete(
    selectedListId ? `${ENDPOINTS.STOCK_LISTS}/${selectedListId}` : "",
  );

  const { del: deleteStockFromListApi } = useDelete(
    selectedListId ? ENDPOINTS.STOCK_LIST_STOCKS(selectedListId) : "",
  );

  const handleDeleteList = async () => {
    if (stockListsWithCount.length <= 1 || !selectedListId) return;
    await deleteListApi();
    refetchStockListsWithCount();
    setShowDeletePopup(false);
  };

  const handleRemoveStockFromList = async (symbol: string) => {
    if (!selectedListId) return;
    await deleteStockFromListApi({
      data: { symbols: [symbol] },
    });
    refetchStocks();
  };

  return (
    <Wrapper>
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "2.5rem 2rem 0 2rem",
        }}
      >
        <Header />
        <StockListTags
          stockListsWithCount={stockListsWithCount}
          setStockListsWithCount={setStockListsWithCount}
          selectedListId={selectedListId}
          setSelectedListId={setSelectedListId}
          setShowDeletePopup={setShowDeletePopup}
          refetchStockListsWithCount={refetchStockListsWithCount}
        />
        <SearchBoxCard
          selectedListId={selectedListId}
          onAdded={refetchStocks}
        />
        <StockList
          stockInfoWithPage={stockInfoWithPage}
          onSelect={(stock) => setSelectedStock(stock)}
          onRemoveStock={(stock) => handleRemoveStockFromList(stock.symbol)}
        />
        {selectedStock && (
          <StockDetailModal
            stock={selectedStock}
            onClose={() => setSelectedStock(null)}
          />
        )}
        {showDeletePopup && (
          <ModalOverlay>
            <ModalContent>
              <div style={{ fontWeight: 600, fontSize: 18 }}>
                Delete this list?
              </div>
              <div style={{ color: "#666", fontSize: 15 }}>
                Are you sure you want to delete "
                {stockListsWithCount.find((l) => l.id === selectedListId)?.name}
                "? This cannot be undone.
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <Button onClick={() => setShowDeletePopup(false)} type="button">
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteList}
                  type="button"
                  disabled={stockListsWithCount.length <= 1}
                  style={{
                    background:
                      stockListsWithCount.length <= 1 ? "#ccc" : undefined,
                  }}
                >
                  Delete
                </Button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </div>
    </Wrapper>
  );
}
