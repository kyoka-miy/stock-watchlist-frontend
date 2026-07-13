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
  Legend,
} from "recharts";
import {
  CashflowHistoryPointSchema,
  StockCashflowHistoryResponse,
} from "@/app/api-interface/stock";
import { ENDPOINTS } from "@/app/constants/endpointConstants";
import { useGet } from "@/app/hooks/useGet";
import LoadingSpinner from "../../molecules/LoadingSpinner";

type Props = {
  symbol: string;
};

type CashflowChartRow = {
  year: string;
  operatingCashflow: number;
  investingCashflow: number;
  financingCashflow: number;
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

const Note = styled.div`
  margin-top: 14px;
  background: #f3f5f8;
  border-radius: 10px;
  padding: 10px 12px;
  color: #657185;
  font-size: 12px;
  line-height: 1.6;
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

const CashflowTooltip = ({ active, payload, label }: TooltipProps) => {
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

export const StockCashflowChart = ({ symbol }: Props) => {
  const { data, isLoading, refetch } = useGet<StockCashflowHistoryResponse>({
    url: ENDPOINTS.STOCK_CASHFLOW_HISTORY(symbol, 6),
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

  const points: CashflowHistoryPointSchema[] = data?.points ?? [];

  if (points.length === 0) {
    return <EmptyText>表示できるキャッシュフローデータがありません</EmptyText>;
  }

  const chartData: CashflowChartRow[] = points.map((p) => ({
    year: String(p.year),
    operatingCashflow: p.operating_cashflow ?? 0,
    investingCashflow: p.investing_cashflow ?? 0,
    financingCashflow: p.financing_cashflow ?? 0,
  }));

  const maxAbs = Math.max(
    ...chartData.map((d) =>
      Math.max(
        Math.abs(d.operatingCashflow),
        Math.abs(d.investingCashflow),
        Math.abs(d.financingCashflow),
      ),
    ),
  );
  const yMax = Math.ceil(maxAbs * 1.2);

  return (
    <Wrapper>
      <ChartTitle>キャッシュフロー推移（過去{data?.years ?? 6}年）</ChartTitle>

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
            domain={[-yMax, yMax]}
            tick={{ fontSize: 11, fill: "#9aa4b2" }}
            axisLine={false}
            tickLine={false}
            width={50}
            tickFormatter={(v: number) => formatCompactNumber(v)}
          />
          <Tooltip content={<CashflowTooltip />} />
          <Legend />
          <Bar
            dataKey="operatingCashflow"
            name="営業CF (億円)"
            fill="#06b6d4"
            radius={[4, 4, 0, 0]}
            barSize={22}
          />
          <Bar
            dataKey="investingCashflow"
            name="投資CF (億円)"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            barSize={22}
          />
          <Bar
            dataKey="financingCashflow"
            name="財務CF (億円)"
            fill="#f97316"
            radius={[4, 4, 0, 0]}
            barSize={22}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <Note>
        営業CF: プラスで継続的な稼ぐ力を示します
        <br />
        投資CF: マイナスは設備・事業投資を示します
        <br />
        財務CF: 借入・返済・配当支払いなどを示します
      </Note>
    </Wrapper>
  );
};
