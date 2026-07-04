"use client";
import styled from "styled-components";
import { formatPointLabel } from "@/app/constants/stockChartConstants";

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  interval?: string;
  period?: string;
};

const PriceTooltipBox = styled.div`
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

const TooltipValue = styled.div`
  font-size: 13px;
  color: #3b82f6;
`;

export default function PriceTooltip({
  active,
  payload,
  label,
  interval = "1d",
  period = "1y",
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const formattedLabel =
    typeof label === "string"
      ? formatPointLabel(label, interval, period, "tooltip")
      : "";

  return (
    <PriceTooltipBox>
      <TooltipTitle>{formattedLabel}</TooltipTitle>
      <TooltipValue>
        株価 (¥) : {payload[0]?.value?.toLocaleString()}
      </TooltipValue>
    </PriceTooltipBox>
  );
}
