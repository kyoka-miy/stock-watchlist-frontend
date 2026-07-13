import { useCallback, useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

type Props = {
  url: string;
  query?: string;
  shouldFetch?: boolean;
};

export function useGet<T = any>({
  url,
  query = "",
  shouldFetch = false,
}: Props) {
  const [data, setData] = useState<T>(null as any);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      const config: AxiosRequestConfig = {
        params: {
          q: query,
        },
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: true,
      };
      const response = await axios.get<T>(url, config);
      const newAccessToken = response.headers["x-new-access-token"];
      if (newAccessToken) {
        localStorage.setItem("access_token", newAccessToken);
      }
      setData(response.data);
      return response.data;
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
