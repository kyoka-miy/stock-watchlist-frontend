import { useCallback, useEffect, useMemo, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

type Props = {
  url: string;
  query?: string;
  shouldFetch?: boolean;
};

export function useGet<T = any>({ url, query = "", shouldFetch = false }: Props) {
  const [data, setData] = useState<T>(null as any);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        setData(result as T);
      } else {
        throw new Error(result.message || "");
      }
      return result as T;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An error occurred";
      console.error("Error fetching data:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [url, query]);

  useEffect(() => {
    if (shouldFetch) {
      refetch();
    }
  }, [shouldFetch, refetch]);

  return { data, isLoading, refetch };
}
