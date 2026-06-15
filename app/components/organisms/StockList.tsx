"use client";
import styled from "styled-components";
import { useState } from "react";
import {
  SortKey,
  StockInfo,
  StockInfoColumns,
  StockInfoWithPage,
} from "@/app/api-interface/stock";
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
  transition:
    background 0.15s,
    color 0.15s;

  &.stock-code,
  &.stock-name {
    color: #1f2937;
    font-weight: 700;
  }
`;
const Tr = styled.tr`
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 12px;
  &:hover {
    background: #e7eef9;
  }

  &:hover ${Td} {
    background: #e7eef9;
  }

  &:hover ${Td}.stock-code, &:hover ${Td}.stock-name {
    color: #2563eb;
  }
`;
const SortIcon = styled.span`
  margin-left: 0.35em;
  font-size: 1em;
`;

const ActionTh = styled.th`
  width: 46px;
  min-width: 46px;
  background: #f3f7fb;
  border-bottom: 2px solid #e3eaf3;
`;

const ActionTd = styled.td`
  width: 46px;
  min-width: 46px;
  padding: 0 0 0 10px;
  border-bottom: 1.5px solid #f2f5fa;
  background: #fff;
  position: relative;
  transition: background 0.15s;

  ${Tr}:hover & {
    background: #e7eef9;
  }
`;

const RemoveAction = styled.div`
  display: inline-flex;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-4px);
  transition:
    opacity 0.14s,
    transform 0.14s;

  ${Tr}:hover & {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }
`;

const RemoveCircle = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 0;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.14s,
    color 0.14s;

  &:hover {
    background: #fee2e2;
    color: #ef4444;
  }
`;

const CloseIcon = styled.span`
  font-family: "Material Symbols Outlined";
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 20;
  font-size: 18px;
  line-height: 1;
`;

const PriceChangeCell = styled.span<{ $positive: boolean; $negative: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-weight: 700;
  color: ${({ $positive, $negative }) =>
    $positive ? "#16a34a" : $negative ? "#dc2626" : "#4b5563"};
`;

const TrendIcon = styled.span<{ $positive: boolean; $negative: boolean }>`
  font-family: "Material Symbols Outlined";
  font-variation-settings:
    "FILL" 0,
    "wght" 600,
    "GRAD" 0,
    "opsz" 20;
  font-size: 18px;
  line-height: 1;
  color: ${({ $positive, $negative }) =>
    $positive ? "#16a34a" : $negative ? "#dc2626" : "#4b5563"};
`;

type Props = {
  stockInfoWithPage: StockInfoWithPage;
  onSelect: (stock: StockInfo) => void;
  onRemoveStock?: (stock: StockInfo) => void;
};

export default function StockList({
  stockInfoWithPage,
  onSelect,
  onRemoveStock,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortAsc, setSortAsc] = useState(true);

  const parseChangeRatio = (value: string | null | undefined) => {
    if (value == null) return 0;
    const normalized = String(value).trim().replace("%", "");
    if (!normalized) return 0;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

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
              <ActionTh />
              {StockInfoColumns.map((col, idx) => (
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
                <ActionTd>
                  <RemoveAction>
                    <RemoveCircle
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStock?.(stock);
                      }}
                    >
                      <CloseIcon>close</CloseIcon>
                    </RemoveCircle>
                  </RemoveAction>
                </ActionTd>
                {StockInfoColumns.map((col, idx) => (
                  <Td
                    key={col.key}
                    className={
                      col.key === "symbol"
                        ? "stock-code"
                        : col.key === "name"
                          ? "stock-name"
                          : undefined
                    }
                    style={{
                      textAlign: col.isNumeric ? "right" : "left",
                      fontWeight:
                        col.key === "symbol" || col.key === "name" ? 700 : 500,
                      fontSize: 15.5,
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
                    {col.key === "price_change_ratio"
                      ? (() => {
                          const ratioValue = stock.price_change_ratio;
                          const ratioText = ratioValue ?? "-";
                          const ratioNumber = parseChangeRatio(ratioValue);
                          const positive = ratioNumber > 0;
                          const negative = ratioNumber < 0;
                          const iconName = positive
                            ? "trending_up"
                            : negative
                              ? "trending_down"
                              : "trending_flat";

                          return (
                            <PriceChangeCell
                              $positive={positive}
                              $negative={negative}
                            >
                              <TrendIcon
                                $positive={positive}
                                $negative={negative}
                              >
                                {iconName}
                              </TrendIcon>
                              {ratioText}
                            </PriceChangeCell>
                          );
                        })()
                      : typeof stock[col.key] === "number"
                        ? col.isNumeric
                          ? (stock[col.key] as number).toLocaleString(
                              undefined,
                              {
                                maximumFractionDigits: 2,
                              },
                            )
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
