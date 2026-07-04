export type PeriodOption = {
  label: string;
  period: string;
  interval: string;
  chartTitle: string;
};

export const PERIOD_OPTIONS: PeriodOption[] = [
  {
    label: "1日",
    period: "1d",
    interval: "15m",
    chartTitle: "株価推移（1日・15分足）",
  },
  {
    label: "5日",
    period: "5d",
    interval: "30m",
    chartTitle: "株価推移（5日・30分足）",
  },
  {
    label: "1ヶ月",
    period: "1mo",
    interval: "1d",
    chartTitle: "株価推移（1ヶ月・日足）",
  },
  {
    label: "3ヶ月",
    period: "3mo",
    interval: "1d",
    chartTitle: "株価推移（3ヶ月・日足）",
  },
  {
    label: "半年",
    period: "6mo",
    interval: "1d",
    chartTitle: "株価推移（半年・日足）",
  },
  {
    label: "年初来",
    period: "ytd",
    interval: "1d",
    chartTitle: "株価推移（年初来・日足）",
  },
  {
    label: "1年",
    period: "1y",
    interval: "1wk",
    chartTitle: "株価推移（1年・週足）",
  },
  {
    label: "2年",
    period: "2y",
    interval: "1mo",
    chartTitle: "株価推移（2年・月足）",
  },
  {
    label: "5年",
    period: "5y",
    interval: "1mo",
    chartTitle: "株価推移（5年・月足）",
  },
  {
    label: "10年",
    period: "10y",
    interval: "1mo",
    chartTitle: "株価推移（10年・月足）",
  },
  {
    label: "全期間",
    period: "max",
    interval: "1mo",
    chartTitle: "株価推移（全期間・月足）",
  },
];

export const INTRADAY_INTERVALS = new Set([
  "1m",
  "5m",
  "15m",
  "30m",
  "60m",
  "1h",
]);

export const formatPointLabel = (
  date: string,
  interval: string,
  period: string,
  mode: "axis" | "tooltip" = "axis",
) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  const year = parsed.getFullYear();
  const month = parsed.getMonth() + 1;
  const day = parsed.getDate();
  const hour = parsed.getHours().toString().padStart(2, "0");
  const minute = parsed.getMinutes().toString().padStart(2, "0");

  if (INTRADAY_INTERVALS.has(interval)) {
    if (mode === "tooltip") {
      return `${year}/${month}/${day} ${hour}:${minute}`;
    }
    if (period === "1d") {
      return `${hour}:${minute}`;
    }
    return `${month}/${day} ${hour}:${minute}`;
  }

  if (interval === "1d") {
    if (mode === "tooltip") {
      return `${year}/${month}/${day}`;
    }
    return `${month}/${day}`;
  }
  if (interval === "1wk") {
    return `${month}/${day}週`;
  }
  return `${year}/${month}`;
};
