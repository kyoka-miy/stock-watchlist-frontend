"use client";
import styled from "styled-components";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";

const Table = styled.table`
  width: 100%;
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
const Th = styled.th<{ sortable?: boolean }>`
  padding: 1.1rem 1.3rem;
  background: #f3f7fb;
  color: #1a2233;
  font-weight: 700;
  font-size: 16px;
  border-bottom: 2px solid #e3eaf3;
  cursor: ${({ sortable }) => (sortable ? "pointer" : "default")};
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
const EditCell = styled.td`
  width: 44px;
  text-align: center;
  background: #fff;
  position: relative;
`;
const EditIconWrapper = styled.span`
  display: none;
  color: #3498db;
  font-size: 1.25rem;
  cursor: pointer;
  ${Tr}:hover & {
    display: inline-block;
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

type SortKey = keyof Stock;
const columns: { key: SortKey; label: string; isNumeric?: boolean }[] = [
  { key: "code", label: "銘柄コード" },
  { key: "name", label: "銘柄名" },
  { key: "price", label: "株価", isNumeric: true },
  { key: "dividendPerShare", label: "前日比", isNumeric: true }, // 仮: 本来は前日比用の値をStock型に追加すべき
  { key: "payoutRatio", label: "出来高", isNumeric: true }, // 仮: 本来は出来高用の値をStock型に追加すべき
  { key: "roe", label: "時価総額", isNumeric: true }, // 仮: 本来は時価総額用の値をStock型に追加すべき
  { key: "per", label: "PER", isNumeric: true },
  { key: "pbr", label: "PBR", isNumeric: true },
  { key: "dividendYield", label: "配当利回り", isNumeric: true },
  { key: "roa", label: "ROE", isNumeric: true },
];

export default function StockList({
  stocks,
  onSelect,
  onEdit,
}: {
  stocks: Stock[];
  onSelect: (stock: Stock) => void;
  onEdit?: (stock: Stock) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortAsc, setSortAsc] = useState(true);

  const sortedStocks = [...stocks].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortAsc ? aValue - bValue : bValue - aValue;
    }
    return sortAsc
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((asc) => !asc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          {columns.map((col) => (
            <Th
              key={col.key}
              sortable={true}
              onClick={() => handleSort(col.key)}
              style={{
                background: "#f7fafd",
                color: "#222b45",
                fontWeight: 700,
                fontSize: 15.5,
                borderBottom: "2px solid #e3eaf3",
                letterSpacing: "0.01em",
              }}
            >
              {col.label}
              {sortKey === col.key && (
                <SortIcon>{sortAsc ? "▲" : "▼"}</SortIcon>
              )}
            </Th>
          ))}
          <Th
            style={{ background: "#f7fafd", borderBottom: "2px solid #e3eaf3" }}
          >
            操作
          </Th>
        </tr>
      </thead>
      <tbody>
        {sortedStocks.map((stock) => (
          <Tr key={stock.code}>
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
                  whiteSpace: idx === 1 ? "nowrap" : undefined,
                }}
                onClick={() => onSelect(stock)}
              >
                {/* Figma画像のような前日比・出来高・時価総額・配当利回り等の表現は本来Stock型拡張が必要。ここでは仮で数値を表示 */}
                {typeof stock[col.key] === "number"
                  ? col.isNumeric
                    ? (stock[col.key] as number).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : stock[col.key]
                  : stock[col.key]}
              </Td>
            ))}
            <EditCell>
              <EditIconWrapper
                onClick={
                  onEdit
                    ? (e) => {
                        e.stopPropagation();
                        onEdit(stock);
                      }
                    : undefined
                }
                title="Edit"
              >
                <FaRegEdit />
              </EditIconWrapper>
            </EditCell>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
