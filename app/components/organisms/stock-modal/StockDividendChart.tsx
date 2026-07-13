"use client";
import { useEffect } from "react";
import styled from "styled-components";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Legend,
} from "recharts";
import {
  DividendHistoryPointSchema,
  StockDividendHistoryResponse,
} from "@/app/api-interface/stock";
import { ENDPOINTS } from "@/app/constants/endpointConstants";
import { useGet } from "@/app/hooks/useGet";
import LoadingSpinner from "../../molecules/LoadingSpinner";

type Props = {
  symbol: string;
};

type DividendChartRow = {
  year: string;
  dividendPerShare: number;
  dividendYield: number;
  payoutRatio: number;
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
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

const DividendTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <TooltipBox>
      <TooltipTitle>{label}</TooltipTitle>
      {payload.map((row) => (
        <TooltipRow key={row.name} $color={row.color}>
          {row.name}: {Number(row.value).toLocaleString()}
          {row.name.includes("率") ? "%" : ""}
        </TooltipRow>
      ))}
    </TooltipBox>
  );
};

export const StockDividendChart = ({ symbol }: Props) => {
  const { data, isLoading, refetch } = useGet<StockDividendHistoryResponse>({
    url: ENDPOINTS.STOCK_DIVIDEND_HISTORY(symbol, 10),
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

  const points: DividendHistoryPointSchema[] = data?.points ?? [];

  if (points.length === 0) {
    return <EmptyText>表示できる配当データがありません</EmptyText>;
  }

  const chartData: DividendChartRow[] = points.map((p) => ({
    year: String(p.year),
    dividendPerShare: p.dividend_per_share ?? 0,
    dividendYield: p.dividend_yield ?? 0,
    payoutRatio: p.payout_ratio ?? 0,
  }));

  const maxDividend = Math.max(...chartData.map((d) => d.dividendPerShare));
  const maxDividendYield = Math.max(...chartData.map((d) => d.dividendYield));
  const maxPayoutRatio = Math.max(...chartData.map((d) => d.payoutRatio));

  return (
    <Wrapper>
      <ChartTitle>配当金推移（過去{data?.years ?? 6}年）</ChartTitle>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
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
            yAxisId="left"
            domain={[0, Math.ceil(maxDividend * 1.15)]}
            tick={{ fontSize: 11, fill: "#9aa4b2" }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <YAxis
            yAxisId="yield"
            orientation="right"
            domain={[0, Math.ceil(maxDividendYield * 1.25)]}
            tick={{ fontSize: 11, fill: "#9aa4b2" }}
            axisLine={false}
            tickLine={false}
            mirror
            width={42}
            tickMargin={8}
            tickFormatter={(v: number) => `${v}%`}
          />
          <YAxis
            yAxisId="payout"
            orientation="right"
            hide
            domain={[0, Math.ceil(maxPayoutRatio * 1.1)]}
          />
          <Tooltip content={<DividendTooltip />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="dividendPerShare"
            name="配当金 (¥)"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            barSize={40}
          />
          <Line
            yAxisId="yield"
            type="monotone"
            dataKey="dividendYield"
            name="配当利回り (%)"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="payout"
            type="monotone"
            dataKey="payoutRatio"
            name="配当性向 (%)"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <StatGrid>
        <StatCard>
          <StatLabel>年平均配当金</StatLabel>
          <StatValue>
            {data?.average_dividend_per_share != null
              ? `¥${data.average_dividend_per_share.toLocaleString()}`
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>最新配当利回り</StatLabel>
          <StatValue>
            {data?.latest_dividend_yield != null
              ? `${data.latest_dividend_yield.toLocaleString()}%`
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>{data?.years ?? 6}年成長率</StatLabel>
          <StatValue>
            {data?.growth_rate_percent != null
              ? `${data.growth_rate_percent.toLocaleString()}%`
              : "-"}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>平均配当性向</StatLabel>
          <StatValue>
            {data?.average_payout_ratio != null
              ? `${data.average_payout_ratio.toLocaleString()}%`
              : "-"}
          </StatValue>
        </StatCard>
      </StatGrid>
    </Wrapper>
  );
};
