import { useState, useEffect, useCallback, useRef } from 'react';
import { AxiosError } from 'axios';
import apiClient from '../api/axios'; 

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  manual?: boolean; 
}

export function useApi<T>(endpoint: string, options?: UseApiOptions) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: !options?.manual,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.get<T>(endpoint, {
        signal: controller.signal,
      });
      setState({ data: response.data, loading: false, error: null });
    } catch (err: unknown) {
      if ((err as AxiosError).isAxiosError) {
        setState({ data: null, loading: false, error: (err as AxiosError).message });
      } else {
        setState({ data: null, loading: false, error: 'An unexpected error occurred' });
      }
    }
  }, [endpoint]);

  useEffect(() => {
    if (!options?.manual) {
      fetchData();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData, options?.manual]);

  return { ...state, refetch: fetchData };
}
