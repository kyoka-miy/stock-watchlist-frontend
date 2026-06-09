("use client");
import Input from "../atoms/Input";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { StockSearchCandidate } from "@/app/api-interface/stock";
import { useState, useRef, useCallback } from "react";
// debounce utility
function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

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
const CandidateRow = styled.div<{ $hovered?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 1.1rem 1.3rem 1.1rem 1.3rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f7fb;
  background: ${({ $hovered }) => ($hovered ? "#eaf3ff" : "#fff")};
  transition: background 0.13s;
  position: relative;
  &:last-child {
    border-bottom: none;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  opacity: 0;
  transition: opacity 0.15s;
  font-size: 15px;
  color: #1769ff;
  font-weight: 700;
  gap: 4px;
  padding: 0;
  &:hover .plus-circle {
    background: #1769ff;
    color: #fff;
    border-color: #1769ff;
  }
  ${CandidateRow}:hover & {
    opacity: 1;
  }
`;

const PlusCircle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #eaf3ff;
  color: #1769ff;
  font-size: 15px;
  font-weight: 700;
  margin-left: 2px;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
  border: 1.5px solid #eaf3ff;
  line-height: 1;
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
  candidates?: StockSearchCandidate[];
  onSelectCandidate?: (c: StockSearchCandidate) => void;
  isLoading: boolean;
};

export default function SearchBox({
  value,
  onChange,
  onSearch,
  candidates = [],
  onSelectCandidate,
  isLoading,
}: Props) {
  const debouncedOnSearch = useCallback(debounce(onSearch, 300), [onSearch]);
  const [focused, setFocused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const showDropdown =
    focused && value && (isLoading || (candidates && candidates.length > 0));

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
          <DropdownHeader>
            {isLoading ? (
              <span style={{ color: "#1769ff", fontWeight: 500 }}>
                検索中...
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    marginLeft: 8,
                    verticalAlign: "middle",
                    border: "2px solid #1769ff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </span>
            ) : (
              <>検索結果: {candidates.length}件</>
            )}
          </DropdownHeader>
          {!isLoading &&
            candidates.map((c, i) => (
              <CandidateRow
                key={c.symbol}
                $hovered={hoveredIndex === i}
                onMouseDown={() => onSelectCandidate?.(c)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(-1)}
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
                  配当:{" "}
                  {c.dividend_yield !== null ? `${c.dividend_yield}%` : "-"}
                </Info>
                <AddButton
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onSelectCandidate?.(c);
                  }}
                  title="追加"
                  style={{ opacity: hoveredIndex === i ? 1 : 0 }}
                >
                  追加
                  <PlusCircle className="plus-circle">＋</PlusCircle>
                </AddButton>
              </CandidateRow>
            ))}
        </Dropdown>
      )}
    </div>
  );
}
