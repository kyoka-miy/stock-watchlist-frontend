("use client");
import { useEffect, useState } from "react";
import Button from "../atoms/Button";
import StockList, { Stock } from "../organisms/StockList";
import styled from "styled-components";
import { StockListTags } from "../organisms/StockListTags";
import { StockListWithCount } from "@/app/api-interface/stockList";
import { ENDPOINTS } from "@/app/constants/endpointConstants";
import { useGet } from "@/app/hooks/useGet";
import { useDelete } from "@/app/hooks/useDelete";
import Card from "../atoms/Card";
import { SearchBoxCard } from "../organisms/SearchBoxCard";
import { StockInfo, StockInfoWithPage } from "@/app/api-interface/stock";

const initialStockLists = [
  {
    id: 1,
    name: "My Stocks",
    stocks: [
      {
        code: "AAPL",
        name: "Apple",
        price: 170,
        dividendYield: 0.55,
        dividendPerShare: 0.96,
        payoutRatio: 15.2,
        per: 28,
        pbr: 45,
        roe: 30,
        roa: 12,
        market: "NASDAQ",
        sector: "Technology",
      },
      {
        code: "GOOGL",
        name: "Google",
        price: 2800,
        dividendYield: 0.0,
        dividendPerShare: 0.0,
        payoutRatio: 0.0,
        per: 25,
        pbr: 10,
        roe: 20,
        roa: 8,
        market: "NASDAQ",
        sector: "Technology",
      },
    ],
  },
  {
    id: 2,
    name: "Tech Giants",
    stocks: [
      {
        code: "MSFT",
        name: "Microsoft",
        price: 320,
        dividendYield: 0.8,
        dividendPerShare: 2.48,
        payoutRatio: 28.5,
        per: 35,
        pbr: 15,
        roe: 40,
        roa: 15,
        market: "NASDAQ",
        sector: "Technology",
      },
      {
        code: "AMZN",
        name: "Amazon",
        price: 3400,
        dividendYield: 0.0,
        dividendPerShare: 0.0,
        payoutRatio: 0.0,
        per: 60,
        pbr: 20,
        roe: 10,
        roa: 3,
        market: "NASDAQ",
        sector: "Consumer Discretionary",
      },
    ],
  },
];

const allStocks: Stock[] = [
  ...initialStockLists.flatMap((l) => l.stocks),
  // 追加でサンプルを増やす場合はここに
  {
    code: "9432",
    name: "日本電信電話",
    price: 156,
    dividendYield: 3.2,
    dividendPerShare: 0,
    payoutRatio: 0,
    per: 11.5,
    pbr: 1.3,
    roe: 0,
    roa: 0,
    market: "東証プライム",
    sector: "通信",
  },
  {
    code: "6594",
    name: "日本電産",
    price: 11450,
    dividendYield: 1.2,
    dividendPerShare: 0,
    payoutRatio: 0,
    per: 28.5,
    pbr: 2.8,
    roe: 0,
    roa: 0,
    market: "東証プライム",
    sector: "電機",
  },
  {
    code: "2914",
    name: "日本たばこ産業",
    price: 3250,
    dividendYield: 6.2,
    dividendPerShare: 0,
    payoutRatio: 0,
    per: 14.8,
    pbr: 1.6,
    roe: 0,
    roa: 0,
    market: "東証プライム",
    sector: "食品",
  },
];

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7fafd;
`;

const Tab = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ active }) => (active ? "#1769ff" : "#fff")};
  border: ${({ active }) => (active ? "none" : "1.5px solid #d0d7e2")};
  border-radius: 16px;
  padding: 0.5rem 1.4rem 0.5rem 1.1rem;
  font-weight: 700;
  color: ${({ active }) => (active ? "#fff" : "#222b45")};
  cursor: pointer;
  min-width: 0;
  box-shadow: ${({ active }) =>
    active ? "0 4px 16px rgba(23,105,255,0.13)" : "none"};
  gap: 10px;
  font-size: 16.5px;
  margin-right: 14px;
  letter-spacing: 0.01em;
  transition:
    box-shadow 0.18s,
    border 0.18s,
    background 0.18s,
    color 0.18s;
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
  const [stockLists, setStockLists] = useState(initialStockLists);
  const [stockListsWithCount, setStockListsWithCount] = useState<
    StockListWithCount[]
  >([]);
  const [selectedListId, setSelectedListId] = useState<number>();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [stocks, setStocks] = useState<StockInfo[]>([]);
  const [editStock, setEditStock] = useState<Stock | null>(null);

  const { data: stockListsWithCountData, refetch: refetchStockListsWithCount } =
    useGet<StockListWithCount[]>({
      url: ENDPOINTS.STOCK_LISTS_WITH_COUNT("2"),
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
  console.log("Stocks data:", stockInfoWithPage);

  const { del: deleteListApi } = useDelete(
    selectedListId ? `${ENDPOINTS.STOCK_LISTS}/${selectedListId}` : "",
  );

  const handleDeleteList = async () => {
    if (stockLists.length <= 1 || !selectedListId) return;
    await deleteListApi();
    refetchStockListsWithCount();
    setShowDeletePopup(false);
  };

  const handleDeleteStock = (stockCode: string) => {
    setStockLists((prev) =>
      prev.map((list) =>
        list.id === selectedListId
          ? { ...list, stocks: list.stocks.filter((s) => s.code !== stockCode) }
          : list,
      ),
    );
    setEditStock(null);
  };

  return (
    <Wrapper>
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "2.5rem 2rem 0 2rem",
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <h1
            style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#222" }}
          >
            株式ウォッチリスト
          </h1>
          <div style={{ color: "#666", fontSize: 16, marginTop: 4 }}>
            気になる銘柄を追加して、重要指標を一覧で比較できます
          </div>
        </div>
        <StockListTags
          stockListsWithCount={stockListsWithCount}
          setStockListsWithCount={setStockListsWithCount}
          selectedListId={selectedListId}
          setSelectedListId={setSelectedListId}
          setShowDeletePopup={setShowDeletePopup}
          refetchStockListsWithCount={refetchStockListsWithCount}
        />
        <SearchBoxCard />
        <Card style={{ margin: 0, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <StockList
            stockInfoWithPage={stockInfoWithPage}
            onSelect={() => {}}
          />
        </Card>
        {editStock && (
          <ModalOverlay>
            <ModalContent>
              <div style={{ fontWeight: 600, fontSize: 18 }}>Edit Stock</div>
              <div style={{ color: "#111", fontSize: 15 }}>
                <b>
                  {editStock.name} ({editStock.code})
                </b>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <Button onClick={() => setEditStock(null)} type="button">
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteStock(editStock.code)}
                  type="button"
                  style={{ background: "#e74c3c" }}
                >
                  Remove from List
                </Button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
        {showDeletePopup && (
          <ModalOverlay>
            <ModalContent>
              <div style={{ fontWeight: 600, fontSize: 18 }}>
                Delete this list?
              </div>
              <div style={{ color: "#666", fontSize: 15 }}>
                Are you sure you want to delete "
                {stockLists.find((l) => l.id === selectedListId)?.name}"? This
                cannot be undone.
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
                  disabled={stockLists.length <= 1}
                  style={{
                    background: stockLists.length <= 1 ? "#ccc" : undefined,
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
