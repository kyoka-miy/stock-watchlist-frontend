import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig } from "axios";

export function useDelete<R = any>(url: string, config?: AxiosRequestConfig) {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const del = useCallback(
    async (overrideConfig?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);
      try {
        const mergedConfig = { ...config, ...overrideConfig };
        const res = await axios.delete<R>(url, mergedConfig);
        setData(res.data);
        return res.data;
      } catch (err) {
        setError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, config],
  );

  return { data, loading, error, del };
}
