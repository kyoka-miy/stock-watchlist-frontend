"use client";
import { useState } from "react";
import Button from "../atoms/Button";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import SearchBox, { SearchCandidate } from "../molecules/SearchBox";
import StockList, { Stock } from "../organisms/StockList";
import styled from "styled-components";

const initialStockLists = [
  {
    id: "my-list",
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
    id: "tech-list",
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

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 2.2rem 2.2rem 1.5rem 2.2rem;
  margin-bottom: 28px;
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

const TabBadge = styled.span<{ active: boolean }>`
  background: ${({ active }) => (active ? "#1769ff" : "#e3e8ef")};
  color: ${({ active }) => (active ? "#fff" : "#6b7684")};
  border-radius: 12px;
  font-size: 13.5px;
  padding: 0 10px;
  margin-left: 6px;
  min-width: 22px;
  text-align: center;
  display: inline-block;
  font-weight: 700;
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
  const [selectedListId, setSelectedListId] = useState(stockLists[0].id);
  const [search, setSearch] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [editStock, setEditStock] = useState<Stock | null>(null);

  const currentList = stockLists.find((l) => l.id === selectedListId)!;
  const filteredStocks = currentList.stocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(search.toLowerCase()) ||
      stock.code.toLowerCase().includes(search.toLowerCase()),
  );

  // 検索候補リスト生成
  const candidates: SearchCandidate[] =
    search.trim().length > 0
      ? allStocks
          .filter((s) => s.name.includes(search) || s.code.includes(search))
          .map((s) => ({
            code: s.code,
            name: s.name,
            price: `¥${s.price.toLocaleString()}`,
            change:
              s.code === "9432"
                ? "-¥15"
                : s.code === "6594"
                  ? "-¥120"
                  : s.code === "2914"
                    ? "-¥18"
                    : "+¥45",
            changeRate:
              s.code === "9432"
                ? "-1.27%"
                : s.code === "6594"
                  ? "-1.04%"
                  : s.code === "2914"
                    ? "-0.55%"
                    : "+1.61%",
            changeColor:
              s.code === "9432" || s.code === "6594" || s.code === "2914"
                ? "#e74c3c"
                : "#00b050",
            per: `${s.per}倍`,
            pbr: `${s.pbr}倍`,
            dividend: `${s.dividendYield}%`,
          }))
      : [];

  // 検索候補選択時の処理例（リストに追加）
  const handleSelectCandidate = (c: SearchCandidate) => {
    if (currentList.stocks.some((s) => s.code === c.code)) return;
    setStockLists((prev) =>
      prev.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              stocks: [
                ...list.stocks,
                allStocks.find((s) => s.code === c.code)!,
              ],
            }
          : list,
      ),
    );
    setSearch("");
  };

  const handleAddList = () => {
    if (!newListName.trim()) return;
    const newId =
      newListName.trim().toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setStockLists([
      ...stockLists,
      { id: newId, name: newListName.trim(), stocks: [] },
    ]);
    setSelectedListId(newId);
    setNewListName("");
    setShowAddPopup(false);
  };

  const handleDeleteList = () => {
    if (stockLists.length <= 1) return;
    const idx = stockLists.findIndex((l) => l.id === selectedListId);
    const newLists = stockLists.filter((l) => l.id !== selectedListId);
    setStockLists(newLists);
    setSelectedListId(newLists[Math.max(0, idx - 1)].id);
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "2rem 0 1.5rem 0",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {stockLists.map((list) => (
              <Tab
                key={list.id}
                active={selectedListId === list.id}
                onClick={() => setSelectedListId(list.id)}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: 2 }}
                  >
                    <rect
                      x="3"
                      y="4.5"
                      width="12"
                      height="1.5"
                      rx="0.75"
                      fill={selectedListId === list.id ? "#fff" : "#6b7684"}
                    />
                    <rect
                      x="3"
                      y="8.25"
                      width="12"
                      height="1.5"
                      rx="0.75"
                      fill={selectedListId === list.id ? "#fff" : "#6b7684"}
                    />
                    <rect
                      x="3"
                      y="12"
                      width="12"
                      height="1.5"
                      rx="0.75"
                      fill={selectedListId === list.id ? "#fff" : "#6b7684"}
                    />
                  </svg>
                  {list.name}
                  <TabBadge active={selectedListId === list.id}>
                    {list.stocks.length}
                  </TabBadge>
                </span>
                {selectedListId === list.id && (
                  <>
                    <FaEdit
                      style={{
                        color: "#fff",
                        cursor: "pointer",
                        marginRight: 2,
                        marginLeft: 8,
                        opacity: 1,
                        fontSize: 17,
                      }}
                      size={17}
                      title="Edit List"
                      onClick={(e) => {
                        e.stopPropagation(); /* 編集ポップアップ等の処理 */
                      }}
                    />
                    <FaTrash
                      style={{
                        color: "#fff",
                        cursor:
                          stockLists.length <= 1 ? "not-allowed" : "pointer",
                        opacity: stockLists.length <= 1 ? 0.5 : 1,
                        marginLeft: 2,
                        fontSize: 17,
                      }}
                      size={17}
                      title="Delete List"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (stockLists.length > 1) setShowDeletePopup(true);
                      }}
                    />
                  </>
                )}
              </Tab>
            ))}
          </div>
          {!showAddPopup ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "2px dashed #bfc8d6",
                borderRadius: 14,
                background: "#fff",
                color: "#222b45",
                fontWeight: 700,
                fontSize: 16,
                padding: "0.5rem 1.3rem",
                gap: 8,
                cursor: "pointer",
                transition: "all 0.18s",
                boxShadow: "none",
                letterSpacing: "0.01em",
              }}
              onClick={() => setShowAddPopup(true)}
              aria-label="新規リスト"
            >
              <FaPlus
                color="#1769ff"
                style={{ marginRight: 6, fontSize: 18 }}
              />{" "}
              新規リスト
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                borderRadius: 18,
                border: "1.5px solid #e3e8ef",
                padding: "0.3rem 0.7rem 0.3rem 1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                style={{
                  padding: "0.45rem 1.1rem",
                  borderRadius: 8,
                  border: "2px solid #3498db",
                  fontSize: 15.5,
                  minWidth: 140,
                  outline: "none",
                  background: "#fff",
                  color: "#222",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                }}
                placeholder="リスト名"
                autoFocus
              />
              <Button
                onClick={handleAddList}
                type="button"
                disabled={!newListName.trim()}
                style={{
                  background: !newListName.trim() ? "#e3e8ef" : "#1abc9c",
                  color: !newListName.trim() ? "#bfc8d6" : "#fff",
                  fontWeight: 700,
                  borderRadius: 10,
                  fontSize: 15.5,
                  padding: "0.4rem 1.1rem",
                  minWidth: 56,
                  border: "none",
                  boxShadow: "none",
                  letterSpacing: "0.01em",
                  transition: "all 0.18s",
                }}
              >
                作成
              </Button>
              <Button
                onClick={() => {
                  setShowAddPopup(false);
                  setNewListName("");
                }}
                type="button"
                style={{
                  background: "#f0f1f4",
                  color: "#222b45",
                  fontWeight: 700,
                  borderRadius: 10,
                  fontSize: 15.5,
                  padding: "0.4rem 1.1rem",
                  minWidth: 56,
                  border: "none",
                  boxShadow: "none",
                  letterSpacing: "0.01em",
                  transition: "all 0.18s",
                }}
              >
                キャンセル
              </Button>
            </div>
          )}
        </div>
        {/* 検索バーのカード化＋説明文 */}
        <Card>
          <SearchBox
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={() => {}}
            candidates={candidates}
            onSelectCandidate={handleSelectCandidate}
          />
          <div style={{ color: "#888", fontSize: 15, marginTop: 8 }}>
            検索結果から銘柄をクリックして追加できます
          </div>
        </Card>
        {/* テーブル部分 */}
        <Card style={{ margin: 0, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <StockList
            stocks={filteredStocks}
            onSelect={() => {}}
            onEdit={setEditStock}
          />
        </Card>
        {/* Edit Stock Popup */}
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
        {/* Add List Popup */}
        {/* 新規リストのインライン入力は上部タブ列右に表示するため、モーダルは不要 */}
        {/* Delete List Popup */}
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
