import { Page } from "./page";

export type StockSearchCandidate = {
  symbol: string;
  name: string;
  current_price: number | null;
  per: number | null;
  pbr: number | null;
  dividend_yield: number | null;
};

export type StockInfo = {
    symbol: string;
    name: string;
    current_price: number | null;
    dividend_yield: number | null;
    dividend_per_share: number | null;
    payout_ratio: number | null;
    per: number | null;
    pbr: number | null;
    roe: number | null;
    roa: number | null;
    market: string | null;
    sector: string | null;
    industry: string | null;
};

export type StockInfoWithPage = {
    name: string;
    stocks: Page<StockInfo>;
}
