const endpointBase = process.env.NEXT_PUBLIC_ENDPOINT_BASE;

export const ENDPOINTS = {
  STOCK_LISTS: `${endpointBase}/stock-lists`,
  STOCK_LIST: (listId: number) => `${endpointBase}/stock-lists/${listId}`,
  STOCK_LIST_STOCKS: (listId: number) =>
    `${endpointBase}/stock-lists/${listId}/stocks`,
  STOCK_LISTS_WITH_COUNT: `${endpointBase}/stock-lists/count`,
  STOCKS_SEARCH: `${endpointBase}/stocks/search`,
  AUTH_GOOGLE: `${endpointBase}/auth/google`,
  AUTH_LOGOUT: `${endpointBase}/auth/logout`,
  STOCK_PRICE_HISTORY: (symbol: string, period: string, interval: string) =>
    `${endpointBase}/stocks/${symbol}/price-history?period=${period}&interval=${interval}`,
  STOCK_DIVIDEND_HISTORY: (symbol: string, years = 6) =>
    `${endpointBase}/stocks/${symbol}/dividend-history?years=${years}`,
};
