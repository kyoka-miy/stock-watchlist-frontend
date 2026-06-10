import { ST } from "next/dist/shared/lib/utils";

const endpointBase = process.env.NEXT_PUBLIC_ENDPOINT_BASE;

export const ENDPOINTS = {
  STOCK_LISTS: `${endpointBase}/stock-lists`,
  STOCK_LIST: (listId: number) => `${endpointBase}/stock-lists/${listId}`,
  STOCK_LIST_STOCKS: (listId: number) => `${endpointBase}/stock-lists/${listId}/stocks`,
  STOCK_LISTS_WITH_COUNT: (accountId: string) =>
    `${endpointBase}/stock-lists/count/${accountId}`,
  STOCKS_SEARCH: `${endpointBase}/stocks/search`,
};
