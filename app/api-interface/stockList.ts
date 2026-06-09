import { StockInfo } from "./stock";

export type StockListWithCount = {
  id: number;
  name: string;
  count: number;
};

export type StockListWithStocks = {
    id: number;
    name: string;
    stocks: StockInfo[];
}