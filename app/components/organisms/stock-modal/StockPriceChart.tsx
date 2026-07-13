"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PricePoint,
  StockPriceHistoryResponse,
} from "@/app/api-interface/stock";
import { ENDPOINTS } from "@/app/constants/endpointConstants";
import {
  PeriodOption,
  PERIOD_OPTIONS,
  formatPointLabel,
} from "@/app/constants/stockChartConstants";
import { useGet } from "@/app/hooks/useGet";
import PriceTooltip from "./PriceTooltip";
import LoadingSpinner from "../../molecules/LoadingSpinner";

type Props = {
  symbol: string;
};

const Wrapper = styled.div``;

const PeriodBar = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const PeriodButton = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid ${({ $active }) => ($active ? "#3b82f6" : "#e2e8f0")};
  background: ${({ $active }) => ($active ? "#3b82f6" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#6b7280")};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #3b82f6;
    color: ${({ $active }) => ($active ? "#fff" : "#3b82f6")};
  }
`;

const ChartTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
`;

const EmptyText = styled.div`
  color: #9aa4b2;
  font-size: 13px;
  padding: 32px 0;
  text-align: center;
`;

const LoadingBox = styled.div`
  padding: 32px 0;
  display: flex;
  justify-content: center;
`;

export const StockPriceChart = ({ symbol }: Props) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(
    PERIOD_OPTIONS[6],
  );

  const { data, isLoading, refetch } = useGet<StockPriceHistoryResponse>({
    url: ENDPOINTS.STOCK_PRICE_HISTORY(
      symbol,
      selectedPeriod.period,
      selectedPeriod.interval,
    ),
    shouldFetch: false,
  });

  useEffect(() => {
    refetch();
  }, [symbol, selectedPeriod]);

  if (isLoading) {
    return (
      <Wrapper>
        <PeriodBar>
          {PERIOD_OPTIONS.map((opt) => (
            <PeriodButton
              key={opt.period}
              $active={selectedPeriod.period === opt.period}
              type="button"
              onClick={() => setSelectedPeriod(opt)}
            >
              {opt.label}
            </PeriodButton>
          ))}
        </PeriodBar>
        <ChartTitle>{selectedPeriod.chartTitle}</ChartTitle>
        <LoadingBox>
          <LoadingSpinner />
        </LoadingBox>
      </Wrapper>
    );
  }

  const chartData: PricePoint[] = data?.points ?? [];

  if (chartData.length === 0) {
    return (
      <Wrapper>
        <PeriodBar>
          {PERIOD_OPTIONS.map((opt) => (
            <PeriodButton
              key={opt.period}
              $active={selectedPeriod.period === opt.period}
              type="button"
              onClick={() => setSelectedPeriod(opt)}
            >
              {opt.label}
            </PeriodButton>
          ))}
        </PeriodBar>
        <ChartTitle>{selectedPeriod.chartTitle}</ChartTitle>
        <EmptyText>表示できる株価データがありません</EmptyText>
      </Wrapper>
    );
  }

  const priceMin = Math.min(...chartData.map((d) => d.close));
  const priceDomain: [number, "auto"] = [Math.floor(priceMin * 0.9), "auto"];

  const tickInterval =
    chartData.length > 60
      ? Math.floor(chartData.length / 12) - 1
      : chartData.length > 30
        ? Math.floor(chartData.length / 8) - 1
        : 0;

  return (
    <Wrapper>
      <PeriodBar>
        {PERIOD_OPTIONS.map((opt) => (
          <PeriodButton
            key={opt.period}
            $active={selectedPeriod.period === opt.period}
            type="button"
            onClick={() => setSelectedPeriod(opt)}
          >
            {opt.label}
          </PeriodButton>
        ))}
      </PeriodBar>

      <ChartTitle>{selectedPeriod.chartTitle}</ChartTitle>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#dbeafe" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f4f8"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9aa4b2" }}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
            tickFormatter={(value: string) =>
              formatPointLabel(
                value,
                selectedPeriod.interval,
                selectedPeriod.period,
                "axis",
              )
            }
          />
          <YAxis
            domain={priceDomain}
            tick={{ fontSize: 11, fill: "#9aa4b2" }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v: number) => v.toLocaleString()}
          />
          <Tooltip
            content={
              <PriceTooltip
                interval={selectedPeriod.interval}
                period={selectedPeriod.period}
              />
            }
            cursor={{
              stroke: "#6b7280",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#3b82f6",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
