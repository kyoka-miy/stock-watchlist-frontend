"use client";
import styled from "styled-components";
import { useState } from "react";
import { StockInfo, StockInfoWithPage } from "@/app/api-interface/stock";
import Card from "../atoms/Card";

const Table = styled.table`
  width: max-content;
  min-width: 1700px;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  margin: 0 auto 8px auto;
  overflow: hidden;
  font-family:
    "Inter", "Helvetica Neue", Arial, "Hiragino Sans", "Meiryo", sans-serif;
`;
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;
const Th = styled.th<{ $sortable?: boolean }>`
  padding: 1.1rem 1.3rem;
  background: #f3f7fb;
  color: #1a2233;
  font-weight: 700;
  font-size: 16px;
  border-bottom: 2px solid #e3eaf3;
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};
  user-select: none;
  white-space: nowrap;
  letter-spacing: 0.01em;
`;
const Td = styled.td`
  padding: 1.05rem 1.3rem;
  border-bottom: 1.5px solid #f2f5fa;
  color: #222;
  background: #fff;
  font-size: 15.5px;
  letter-spacing: 0.01em;
`;
const Tr = styled.tr`
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 12px;
  &:hover {
    background: #eaf3fd;
  }
`;
const SortIcon = styled.span`
  margin-left: 0.35em;
  font-size: 1em;
`;

export type Stock = {
  code: string;
  name: string;
  price: number;
  dividendYield: number;
  dividendPerShare: number;
  payoutRatio: number;
  per: number;
  pbr: number;
  roe: number;
  roa: number;
  market: string;
  sector: string;
};

type SortKey = keyof StockInfo;
const columns: { key: SortKey; label: string; isNumeric?: boolean }[] = [
  { key: "symbol", label: "銘柄コード" },
  { key: "name", label: "銘柄名" },
  { key: "current_price", label: "株価", isNumeric: true },
  { key: "dividend_yield", label: "配当利回り", isNumeric: true },
  { key: "dividend_per_share", label: "1株配当", isNumeric: true },
  { key: "payout_ratio", label: "配当性向", isNumeric: true },
  { key: "per", label: "PER", isNumeric: true },
  { key: "pbr", label: "PBR", isNumeric: true },
  { key: "roe", label: "ROE", isNumeric: true },
  { key: "roa", label: "ROA", isNumeric: true },
  { key: "market", label: "市場" },
  { key: "sector", label: "セクター" },
  { key: "industry", label: "業種" },
];

type Props = {
  stockInfoWithPage: StockInfoWithPage;
  onSelect: (stock: StockInfo) => void;
};

export default function StockList({ stockInfoWithPage, onSelect }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortAsc, setSortAsc] = useState(true);

  const sortedStocks =
    stockInfoWithPage && stockInfoWithPage.stocks.items.length > 0
      ? [...stockInfoWithPage.stocks.items].sort((a, b) => {
          const aValue = a[sortKey];
          const bValue = b[sortKey];
          if (typeof aValue === "number" && typeof bValue === "number") {
            return sortAsc ? aValue - bValue : bValue - aValue;
          }
          return sortAsc
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        })
      : [];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((asc) => !asc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <Card>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <Th
                  key={col.key}
                  $sortable={true}
                  onClick={() => handleSort(col.key)}
                  style={{
                    background: "#f7fafd",
                    color: "#222b45",
                    fontWeight: 700,
                    fontSize: 15.5,
                    borderBottom: "2px solid #e3eaf3",
                    letterSpacing: "0.01em",
                    width: idx === 1 ? 220 : undefined,
                    minWidth: idx === 1 ? 220 : undefined,
                    whiteSpace: idx === 1 ? "normal" : undefined,
                  }}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <SortIcon>{sortAsc ? "▲" : "▼"}</SortIcon>
                  )}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock) => (
              <Tr key={stock.symbol} onClick={() => onSelect(stock)}>
                {columns.map((col, idx) => (
                  <Td
                    key={col.key}
                    style={{
                      textAlign: col.isNumeric ? "right" : "left",
                      color: idx === 0 ? "#3498db" : "#222",
                      fontWeight: idx === 0 ? 700 : 500,
                      fontSize: 15.5,
                      background: "#fff",
                      letterSpacing: "0.01em",
                      width: idx === 1 ? 220 : undefined,
                      minWidth: idx === 1 ? 220 : undefined,
                      maxWidth: idx === 1 ? 220 : undefined,
                      whiteSpace: idx === 1 ? "normal" : undefined,
                      wordBreak: idx === 1 ? "break-word" : undefined,
                      overflowWrap: idx === 1 ? "anywhere" : undefined,
                      lineHeight: idx === 1 ? 1.35 : undefined,
                    }}
                    onClick={() => onSelect(stock)}
                  >
                    {typeof stock[col.key] === "number"
                      ? col.isNumeric
                        ? (stock[col.key] as number).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : stock[col.key]
                      : stock[col.key]}
                  </Td>
                ))}
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Card>
  );
}
