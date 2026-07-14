import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router";
import LinearProgress from '@mui/material/LinearProgress';
import App from './App';
import Home from './components/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Users = lazy(() => import('./components/Users'));
const Ranks = lazy(() => import('./components/Ranks'));
const Globals = lazy(() => import('./components/Globals'));
const MapsPage = lazy(() => import('./components/MapsPage'));
const Compare = lazy(() => import('./components/Compare'));
const Terms = lazy(() => import('./components/Terms'));
const Privacy = lazy(() => import('./components/Privacy'));
const Settings = lazy(() => import('./components/Settings'));
const MapsHome = lazy(() => import('./components/MapsHome'));
const Replays = lazy(() => import('./components/Replays'));

function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
    return function SuspendedRoute() {
        return (
            <Suspense fallback={<LinearProgress sx={{ position: "fixed", inset: "68px 0 auto", zIndex: 1200, height: 2 }} />}>
                <Component />
            </Suspense>
        );
    };
}

const LazyUsers = withSuspense(Users);
const LazyRanks = withSuspense(Ranks);
const LazyGlobals = withSuspense(Globals);
const LazyMapsPage = withSuspense(MapsPage);
const LazyCompare = withSuspense(Compare);
const LazyTerms = withSuspense(Terms);
const LazyPrivacy = withSuspense(Privacy);
const LazySettings = withSuspense(Settings);
const LazyMapsHome = withSuspense(MapsHome);
const LazyReplays = withSuspense(Replays);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 10 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});

const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            { index: true, Component: Home },
            { 
                path: "users", 
                children: [
                    { index: true, Component: LazyUsers },
                    { path: ":id", Component: LazyUsers }
                ]
            },
            { 
                path: "maps", 
                children: [
                    { index: true, Component: LazyMapsHome },
                    { path: ":id", Component: LazyMapsPage }
                ]
            },
            { path: "ranks", Component: LazyRanks },
            { path: "globals", Component: LazyGlobals },
            { path: "compare", Component: LazyCompare },
            { path: "terms", Component: LazyTerms },
            { path: "privacy", Component: LazyPrivacy },
            { path: "settings", Component: LazySettings },
            { path: "replays/:id", Component: LazyReplays }
        ]
    }
]);

export default function Index() {
    return (
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
    );
}

root.render(
    <Index />
);
