"use client";
import styled from "styled-components";
import { StockInfo } from "@/app/api-interface/stock";

type Props = {
  stock: StockInfo;
};

const SectionTitle = styled.div`
  font-size: 13px;
  color: #8b95a7;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
`;

const MetricCard = styled.div`
  background: #f3f5f8;
  border-radius: 10px;
  padding: 12px 12px 10px 12px;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #8b95a7;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #1f2937;
`;

export const StockBasicIndicators = ({ stock }: Props) => {
  return (
    <>
      <SectionTitle>バリュエーション</SectionTitle>
      <Grid>
        <MetricCard>
          <MetricLabel>PER</MetricLabel>
          <MetricValue>{stock.per}倍</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>PBR</MetricLabel>
          <MetricValue>{stock.pbr}倍</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>配当利回り</MetricLabel>
          <MetricValue>{stock.dividend_yield}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>ROE</MetricLabel>
          <MetricValue>{stock.roe}</MetricValue>
        </MetricCard>
      </Grid>

      <SectionTitle>1株あたり指標</SectionTitle>
      <Grid>
        <MetricCard>
          <MetricLabel>1株配当</MetricLabel>
          <MetricValue>{stock.dividend_per_share}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>配当性向</MetricLabel>
          <MetricValue>{stock.payout_ratio}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>出来高</MetricLabel>
          <MetricValue>{stock.volume}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>時価総額</MetricLabel>
          <MetricValue>{stock.market_cap}</MetricValue>
        </MetricCard>
      </Grid>

      <SectionTitle>収益性・財務健全性</SectionTitle>
      <Grid>
        <MetricCard>
          <MetricLabel>営業利益率</MetricLabel>
          <MetricValue>{stock.operating_margin}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>流動比率</MetricLabel>
          <MetricValue>{stock.current_ratio}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>売上成長率</MetricLabel>
          <MetricValue>{stock.revenue_growth}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>利益成長率</MetricLabel>
          <MetricValue>{stock.earnings_growth}</MetricValue>
        </MetricCard>
      </Grid>
    </>
  );
};
