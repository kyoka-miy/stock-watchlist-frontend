export type StockListWithCount = {
  id: number;
  name: string;
  count: number;
};

export type StockSearchResponse = {
    symbol: string;
    name: string;
    current_price: number | null;
    per: number | null;
    pbr: number | null;
    dividend_yield: number | null;
}