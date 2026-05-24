"use client";
import Input from "../atoms/Input";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { useState, useRef, useCallback } from "react";
// debounce utility
function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
import { StockSearchResponse } from "@/app/api-interface/stockList";

const Wrapper = styled.div<{ $focused: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: #f7fafd;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(52, 152, 219, 0.08);
  padding: 0.35rem 1.1rem 0.35rem 1.1rem;
  border: 2px solid ${({ $focused }) => ($focused ? "#1769ff" : "#e3eaf3")};
  min-height: 48px;
  transition: border 0.18s;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 56px;
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(23, 105, 255, 0.1);
  z-index: 10;
  margin-top: 4px;
  overflow: hidden;
`;
const DropdownHeader = styled.div`
  background: #f3f8ff;
  color: #1769ff;
  font-weight: 700;
  font-size: 15px;
  padding: 0.7rem 1.3rem 0.7rem 1.3rem;
  border-bottom: 1.5px solid #e3eaf3;
`;
const CandidateRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 1.1rem 1.3rem 1.1rem 1.3rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f7fb;
  background: #fff;
  transition: background 0.13s;
  &:hover {
    background: #f3f8ff;
  }
  &:last-child {
    border-bottom: none;
  }
`;
const Code = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #222b45;
  min-width: 60px;
`;
const Name = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #222b45;
  margin-right: 8px;
`;
const Price = styled.span`
  font-size: 15.5px;
  font-weight: 700;
  color: #222b45;
  margin-right: 8px;
`;
const Change = styled.span<{ color: string }>`
  font-size: 15.5px;
  font-weight: 700;
  color: ${({ color }) => color};
  margin-right: 8px;
`;
const Info = styled.span`
  font-size: 14px;
  color: #6b7684;
  margin-right: 10px;
`;

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  candidates?: StockSearchResponse[];
  onSelectCandidate?: (c: StockSearchResponse) => void;
};

export default function SearchBox({
  value,
  onChange,
  onSearch,
  candidates = [],
  onSelectCandidate,
}: Props) {
  const debouncedOnSearch = useCallback(debounce(onSearch, 400), [onSearch]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const showDropdown = focused && value && candidates && candidates.length > 0;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Wrapper $focused={focused} onClick={() => inputRef.current?.focus()}>
        <FaSearch
          style={{
            color: "#bfc8d6",
            fontSize: 18,
            marginRight: 8,
            marginLeft: 2,
          }}
        />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e);
            debouncedOnSearch();
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          placeholder="銘柄名やコードで検索"
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            boxShadow: "none",
            fontSize: 17,
            padding: "0.7rem 0.5rem",
          }}
        />
      </Wrapper>
      {showDropdown && (
        <Dropdown>
          <DropdownHeader>検索結果: {candidates.length}件</DropdownHeader>
          {candidates.map((c) => (
            <CandidateRow
              key={c.symbol}
              onMouseDown={() => onSelectCandidate?.(c)}
            >
              <Code>{c.symbol}</Code>
              <Name>{c.name}</Name>
              <Price>
                {c.current_price !== null
                  ? `¥${c.current_price.toLocaleString()}`
                  : "-"}
              </Price>
              {/* <Change color={c.changeColor}>
                {c.change} {c.changeRate}
              </Change> */}
              <Info>PER: {c.per !== null ? `${c.per}倍` : "-"}</Info>
              <Info>PBR: {c.pbr !== null ? `${c.pbr}倍` : "-"}</Info>
              <Info>
                配当: {c.dividend_yield !== null ? `${c.dividend_yield}%` : "-"}
              </Info>
            </CandidateRow>
          ))}
        </Dropdown>
      )}
    </div>
  );
}
