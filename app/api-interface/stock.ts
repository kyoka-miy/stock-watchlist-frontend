import { Page } from "./page";

export type StockSearchCandidate = {
  symbol: string;
  name: string;
  current_price: number | null;
  per: number | null;
  pbr: number | null;
  dividend_yield: number | null;
};

export type PricePoint = {
  date: string;
  close: number;
};

export type StockInfo = {
  symbol: string;
  name: string;
  current_price: string;
  price_change_ratio: string;
  volume: string;
  market_cap: string;
  per: number;
  pbr: number;
  roe: number;
  roa: number;
  operating_margin: string;
  revenue_growth: string;
  earnings_growth: string;
  profit_growth: string;
  current_ratio: string;
  dividend_yield: string;
  dividend_per_share: string;
  payout_ratio: string;
  free_cash_flow: string;
  industry: string;
  market: string;
};

export type SortKey = keyof StockInfo;
export const StockInfoColumns: {
  key: SortKey;
  label: string;
  isNumeric?: boolean;
}[] = [
  { key: "symbol", label: "銘柄コード" },
  { key: "name", label: "銘柄名" },
  { key: "current_price", label: "株価" },
  { key: "price_change_ratio", label: "前日比" },
  { key: "volume", label: "出来高" },
  { key: "market_cap", label: "時価総額" },
  { key: "per", label: "PER", isNumeric: true },
  { key: "pbr", label: "PBR", isNumeric: true },
  { key: "roe", label: "ROE", isNumeric: true },
  { key: "roa", label: "ROA", isNumeric: true },
  { key: "operating_margin", label: "営業利益率" },
  { key: "revenue_growth", label: "売上成長率" },
  { key: "earnings_growth", label: "利益成長率" },
  { key: "profit_growth", label: "純利益成長率" },
  { key: "current_ratio", label: "流動比率" },
  { key: "dividend_yield", label: "配当利回り" },
  { key: "dividend_per_share", label: "1株配当" },
  { key: "payout_ratio", label: "配当性向" },
  { key: "free_cash_flow", label: "フリーCF" },
  { key: "market", label: "市場" },
  { key: "industry", label: "業種" },
];

export type StockInfoWithPage = {
  name: string;
  stocks: Page<StockInfo>;
};

export type StockPriceHistoryResponse = {
  symbol: string;
  period: string;
  interval: string;
  points: PricePoint[];
};

export type StockDividendHistoryResponse = {
  symbol: string;
  years: number;
  points: DividendHistoryPointSchema[];
  average_dividend_per_share: number | null;
  latest_dividend_yield: number | null;
  growth_rate_percent: number | null;
  average_payout_ratio: number | null;
};

export type DividendHistoryPointSchema = {
  year: number;
  dividend_per_share: number;
  dividend_yield: number | null;
  payout_ratio: number | null;
};
