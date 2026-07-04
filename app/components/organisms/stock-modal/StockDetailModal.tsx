"use client";
import { useState } from "react";
import styled from "styled-components";
import { StockInfo } from "@/app/api-interface/stock";
import { StockPriceChart } from "./StockPriceChart";
import { StockDividendChart } from "./StockDividendChart";
import { StockBasicIndicators } from "./StockBasicIndicators";

type Props = {
  stock: StockInfo;
  onClose: () => void;
};

const Overlay = styled.div`
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

const DetailModal = styled.div`
  width: min(1080px, 92vw);
  max-height: 84vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.28);
`;

const DetailHeader = styled.div`
  padding: 18px 22px 12px 22px;
  border-bottom: 1px solid #e6eaf0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: #98a1b2;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
`;

const DetailTabs = styled.div`
  display: flex;
  gap: 28px;
  padding: 0 22px;
  border-bottom: 1px solid #e6eaf0;
`;

const Tab = styled.button<{ $active?: boolean }>`
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "#1f2937" : "transparent")};
  color: ${({ $active }) => ($active ? "#1f2937" : "#9aa4b2")};
  font-size: 14px;
  font-weight: 700;
  padding: 13px 0 11px 0;
  cursor: pointer;
`;

const DetailBody = styled.div`
  padding: 18px 22px 24px 22px;
`;

export const StockDetailModal = ({ stock, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<
    "基本指標" | "株価推移" | "配当金" | "キャッシュフロー" | "業績"
  >("基本指標");

  return (
    <Overlay onClick={onClose}>
      <DetailModal onClick={(e) => e.stopPropagation()}>
        <DetailHeader>
          <div>
            <div style={{ fontSize: 12, color: "#98a1b2", fontWeight: 700 }}>
              {stock.symbol} {stock.market}
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#1f2937",
                lineHeight: 1.1,
              }}
            >
              {stock.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#1f2937",
                  lineHeight: 1,
                }}
              >
                {stock.current_price}
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: String(stock.price_change_ratio).startsWith("-")
                    ? "#dc2626"
                    : "#16a34a",
                }}
              >
                {stock.price_change_ratio}
              </span>
            </div>
          </div>
          <CloseButton type="button" onClick={onClose}>
            x
          </CloseButton>
        </DetailHeader>

        <DetailTabs>
          <Tab
            $active={activeTab === "基本指標"}
            onClick={() => setActiveTab("基本指標")}
          >
            基本指標
          </Tab>
          <Tab
            $active={activeTab === "株価推移"}
            onClick={() => setActiveTab("株価推移")}
          >
            株価推移
          </Tab>
          <Tab
            $active={activeTab === "配当金"}
            onClick={() => setActiveTab("配当金")}
          >
            配当金
          </Tab>
          <Tab
            $active={activeTab === "キャッシュフロー"}
            onClick={() => setActiveTab("キャッシュフロー")}
          >
            キャッシュフロー
          </Tab>
          <Tab
            $active={activeTab === "業績"}
            onClick={() => setActiveTab("業績")}
          >
            業績
          </Tab>
        </DetailTabs>

        <DetailBody>
          {activeTab === "株価推移" && (
            <StockPriceChart symbol={stock.symbol} />
          )}
          {activeTab === "配当金" && (
            <StockDividendChart symbol={stock.symbol} />
          )}
          {activeTab === "基本指標" && <StockBasicIndicators stock={stock} />}
        </DetailBody>
      </DetailModal>
    </Overlay>
  );
};
