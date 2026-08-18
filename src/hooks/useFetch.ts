import { useState, useEffect, useCallback } from "react";

interface UseFetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useFetch<T>(
    fetchFn: () => Promise<T>,
    deps: unknown[] = []
): UseFetchState<T> & { refetch: () => void } {
    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    const load = useCallback(() => {
        setState((s) => ({
            ...s,
            loading: true,
            error: null,
        }));

        fetchFn()
            .then((res) => {
                setState({
                    data: res,
                    loading: false,
                    error: null,
                });
            })
            .catch((err) => {
                console.error("useFetch error:", err);

                setState({
                    data: null,
                    loading: false,
                    error:
                        err?.response?.data?.message ??
                        err?.message ??
                        "Có lỗi xảy ra",
                });
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        load();
    }, [load]);

    return {
        ...state,
        refetch: load,
    };
}