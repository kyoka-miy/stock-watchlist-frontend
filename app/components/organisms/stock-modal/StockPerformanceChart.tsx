"use client";
import { useEffect } from "react";
import styled from "styled-components";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PerformanceHistoryPointSchema,
  StockPerformanceHistoryResponse,
} from "@/app/api-interface/stock";
import { ENDPOINTS } from "@/app/constants/endpointConstants";
import { useGet } from "@/app/hooks/useGet";
import LoadingSpinner from "../../molecules/LoadingSpinner";

type Props = {
  symbol: string;
};

type PerformanceChartRow = {
  year: string;
  revenue: number;
  operatingIncome: number;
  netIncome: number;
};

const Wrapper = styled.div``;

const ChartTitle = styled.div`
  font-size: 32px;
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

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #f3f5f8;
  border-radius: 10px;
  padding: 12px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #8b95a7;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 34px;
  font-weight: 800;
  color: #1f2937;
`;

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
};

const formatCompactNumber = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(value);
};

const TooltipBox = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TooltipTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

const TooltipRow = styled.div<{ $color: string }>`
  font-size: 13px;
  color: ${({ $color }) => $color};
`;

const PerformanceTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <TooltipBox>
      <TooltipTitle>{label}</TooltipTitle>
      {payload.map((row) => (
        <TooltipRow key={row.name} $color={row.color}>
          {row.name}: {formatCompactNumber(Number(row.value))}
        </TooltipRow>
      ))}
    </TooltipBox>
  );
};

export const StockPerformanceChart = ({ symbol }: Props) => {
  const { data, isLoading, refetch } = useGet<StockPerformanceHistoryResponse>({
    url: ENDPOINTS.STOCK_PERFORMANCE_HISTORY(symbol, 6),
    shouldFetch: false,
  });

  useEffect(() => {
    refetch();
  }, [symbol]);

  if (isLoading) {
    return (
      <LoadingBox>
        <LoadingSpinner />
      </LoadingBox>
    );
  }

  const points: PerformanceHistoryPointSchema[] = data?.points ?? [];

  if (points.length === 0) {
    return <EmptyText>表示できる業績データがありません</EmptyText>;
  }

  const chartData: PerformanceChartRow[] = points.map((p) => ({
    year: String(p.year),
    revenue: p.revenue ?? 0,
    operatingIncome: p.operating_income ?? 0,
    netIncome: p.net_income ?? 0,
  }));

  const yMax = Math.ceil(
    Math.max(
      ...chartData.map((d) =>
        Math.max(d.revenue, d.operatingIncome, d.netIncome),
      ),
    ) * 1.1,
  );

  return (
    <Wrapper>
      <ChartTitle>業績推移（過去{data?.years ?? 6}年）</ChartTitle>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 18, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f4f8"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: "#9aa4b2" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, yMax]}
            tick={{ fontSize: 11, fill: "#9aa4b2" }}
            axisLine={false}
            tickLine={false}
            width={62}
            tickMargin={6}
            tickFormatter={(v: number) => formatCompactNumber(v)}
          />
          <Tooltip content={<PerformanceTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="売上高 (億円)"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="operatingIncome"
            name="営業利益 (億円)"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="netIncome"
            name="純利益 (億円)"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <StatGrid>
        <StatCard>
          <StatLabel>売上高成長率</StatLabel>
          <StatValue>
            {data?.revenue_growth_percent != null
              ? `${data.revenue_growth_percent.toLocaleString()}%`
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>営業利益率</StatLabel>
          <StatValue>
            {data?.operating_margin_percent != null
              ? `${data.operating_margin_percent.toLocaleString()}%`
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>純利益成長率</StatLabel>
          <StatValue>
            {data?.net_income_growth_percent != null
              ? `${data.net_income_growth_percent.toLocaleString()}%`
              : "-"}
          </StatValue>
        </StatCard>
      </StatGrid>
    </Wrapper>
  );
};
