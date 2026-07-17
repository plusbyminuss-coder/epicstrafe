import { Dispatch, SetStateAction, useCallback, useState } from "react";

export type CachedRoute = "users" | "globals" | "maps" | "ranks" | "compare";

const routeCache = new Map<CachedRoute, string>();
const stateCache = new Map<string, unknown>();

export function getCachedRoute(pathname: string, search: string): CachedRoute | undefined {
    const route = pathname.split("/")[1];
    if (route === "users" || route === "globals" || route === "maps" || route === "ranks" || route === "compare") {
        routeCache.set(route, `${pathname}${search}`);
        return route;
    }
    return undefined;
}

export function rememberCurrentRoute(): void {
    getCachedRoute(window.location.pathname, window.location.search);
}

export function getCachedRouteHref(route: CachedRoute, fallback: string): string {
    return routeCache.get(route) ?? fallback;
}

export function useNavigationCacheState<T>(key: string, initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        if (stateCache.has(key)) return stateCache.get(key) as T;
        return typeof initialState === "function" ? (initialState as () => T)() : initialState;
    });

    const setCachedState: Dispatch<SetStateAction<T>> = useCallback((value) => {
        setState((previous) => {
            const next = typeof value === "function"
                ? (value as (previous: T) => T)(previous)
                : value;
            stateCache.set(key, next);
            return next;
        });
    }, [key]);

    return [state, setCachedState];
}
