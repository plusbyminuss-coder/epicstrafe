import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PaletteMode, ThemeProvider, alpha, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from "@mui/material/Box";
import { Outlet, useLocation } from "react-router";
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router';
import Link, { LinkProps } from '@mui/material/Link';
import { ContextParams, MapCount } from "./common/common";
import { Breadcrumbs, useMediaQuery } from "@mui/material";
import { Game, Map, SettingsValues } from "shared";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { sortMapsByName } from "./common/sort";
import { saveSettingsToLocalStorage, useLoginUser, useMaps, useSettings } from "./common/states";
import RobloxIcon from "./components/icons/RobloxIcon";
import DiscordIcon from "./components/icons/DiscordIcon";
import GithubIcon from "./components/icons/GithubIcon";
import MainAppBar from "./components/other/MainAppBar";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

const LinkBehavior = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;

    return <RouterLink ref={ref} to={href} {...other} />;
});

function App() {
    const { data: maps } = useMaps();

    const loginUserQuery = useLoginUser();
    const loggedInUser = loginUserQuery.data ?? undefined;
    const loggedInUserLoading = loginUserQuery.isLoading;

    const [ settings, setSettingsState ] = useSettings();
    const [ mode, setMode ] = useState<PaletteMode>(localStorage.getItem("theme") as PaletteMode || "dark");

    const smallScreen = useMediaQuery("@media screen and (max-width: 480px)");
    const location = useLocation();

    const setSettings = useCallback((settings: SettingsValues) => {
        setMode(settings.theme);
        setSettingsState({...settings});
        saveSettingsToLocalStorage(settings);
    }, [setSettingsState]);

    const mapInfo = useMemo(() => {
        const counts : MapCount = {
            bhop: 0,
            surf: 0,
            flyTrials: 0
        }
        const now = new Date();
        const mapList = Object.values(maps ?? {}) as Map[];

        for (const map of mapList) {
            const date = new Date(map.date);
            if (date > now) {
                continue;
            }

            ++counts.flyTrials;
            if (map.game === Game.bhop) {
                ++counts.bhop;
            }
            else if (map.game === Game.surf) {
                ++counts.surf;
            }
        }

        const sortedByPopularity = [...mapList].sort((a, b) => a.loadCount - b.loadCount);
        let highPercentileLoadCount = 0;
        if (sortedByPopularity.length > 0) {
            highPercentileLoadCount = sortedByPopularity[Math.round((sortedByPopularity.length - 1) * 0.98)].loadCount;
        }

        return {
            maps: maps ?? {},
            sortedMaps: [...mapList].sort(sortMapsByName),
            mapCounts: counts,
            highPercentileLoadCount: highPercentileLoadCount
        };
    }, [maps]);

    const contextParams: ContextParams = useMemo(() => {
        return {
            maps: mapInfo.maps,
            sortedMaps: mapInfo.sortedMaps,
            mapCounts: mapInfo.mapCounts,
            highPercentileLoadCount: mapInfo.highPercentileLoadCount,
            settings: settings,
            loginUser: loggedInUser ?? undefined,
            setSettings: setSettings,
            setMode: setMode
        };
    }, [loggedInUser, mapInfo.mapCounts, mapInfo.maps, mapInfo.highPercentileLoadCount, mapInfo.sortedMaps, setSettings, settings]);

    useEffect(() => {
        if (loggedInUser?.settings) {
            setSettings(loggedInUser.settings);
        }
    }, [loggedInUser?.settings, setSettings]);

    const settingsOpen = location.pathname.startsWith("/settings");
    useEffect(() => {

        setMode(settings.theme);
    }, [settings.theme, settingsOpen]);

    const theme = useMemo(() => {
        const isLight = mode === "light";
        const surface = isLight ? "#ffffff" : "#15151f";
        const border = isLight ? "rgba(28, 28, 38, 0.11)" : "rgba(255, 255, 255, 0.11)";

        return createTheme({
            palette: {
                primary: {
                    main: "#ec3b83",
                    light: "#ff6da9",
                    dark: "#b91559",
                    contrastText: "#ffffff"
                },
                secondary: {
                    main: isLight ? "#087ea4" : "#56c7e9",
                    light: "#8be5ff",
                    dark: "#075f7c"
                },
                mode: mode,
                background: {
                    default: isLight ? "#f5f5f7" : "#0d0d12",
                    paper: surface
                },
                text: {
                    primary: isLight ? "#202027" : "#f4f4f6",
                    secondary: isLight ? "#666672" : "#a7a7b2"
                },
                divider: border,
                DataGrid: {
                    bg: surface
                }
            },
            shape: {
                borderRadius: 12
            },
            typography: {
                fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
                h1: { fontWeight: 700, letterSpacing: "-0.04em" },
                h2: { fontWeight: 700, letterSpacing: "-0.035em" },
                h3: { fontWeight: 700, letterSpacing: "-0.03em" },
                h4: { fontWeight: 700, letterSpacing: "-0.025em" },
                h5: { fontWeight: 600, letterSpacing: "-0.015em" },
                h6: { fontWeight: 600, letterSpacing: "-0.01em" },
                button: { fontWeight: 600, letterSpacing: "-0.01em" }
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        html: { backgroundColor: isLight ? "#f4f3f7" : "#09090f" },
                        body: {
                            backgroundColor: isLight ? "#f4f3f7" : "#09090f",
                            backgroundImage: isLight
                                ? "radial-gradient(circle at 50% -20%, rgba(236, 59, 131, 0.10), transparent 38rem)"
                                : "radial-gradient(circle at 50% -20%, rgba(236, 59, 131, 0.17), transparent 40rem)",
                            backgroundAttachment: "fixed"
                        },
                        "#root": {
                            position: "relative",
                            isolation: "isolate"
                        },
                        "#root::before, #root::after": {
                            content: '\"\"',
                            position: "fixed",
                            zIndex: -1,
                            width: "min(46vw, 680px)",
                            aspectRatio: "1",
                            borderRadius: "50%",
                            pointerEvents: "none",
                            filter: "blur(90px)",
                            opacity: isLight ? 0.16 : 0.20,
                            willChange: "transform"
                        },
                        "#root::before": {
                            top: "-22%",
                            left: "-13%",
                            background: "#ec3b83",
                            animation: "ambientDriftA 18s ease-in-out infinite alternate"
                        },
                        "#root::after": {
                            right: "-15%",
                            bottom: "-30%",
                            background: isLight ? "#56c7e9" : "#259dc8",
                            animation: "ambientDriftB 22s ease-in-out infinite alternate"
                        },
                        "@keyframes ambientDriftA": {
                            from: { transform: "translate3d(0, 0, 0) scale(0.9)" },
                            to: { transform: "translate3d(12vw, 10vh, 0) scale(1.12)" }
                        },
                        "@keyframes ambientDriftB": {
                            from: { transform: "translate3d(0, 0, 0) scale(1)" },
                            to: { transform: "translate3d(-10vw, -8vh, 0) scale(0.86)" }
                        },
                        "@keyframes pageEnter": {
                            from: { opacity: 0, transform: "translate3d(0, 8px, 0)", filter: "blur(3px)" },
                            to: { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0)" }
                        },
                        "@keyframes cardEnter": {
                            from: { opacity: 0, transform: "translate3d(0, 14px, 0) scale(0.985)" },
                            to: { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }
                        },
                        "::selection": {
                            backgroundColor: alpha("#ec3b83", 0.32)
                        },
                        "*": {
                            scrollbarWidth: "thin",
                            scrollbarColor: `${alpha(isLight ? "#202027" : "#ffffff", 0.22)} transparent`
                        },
                        "h1, h2, h3": {
                            letterSpacing: "-0.03em"
                        },
                        "@media (prefers-reduced-motion: reduce)": {
                            "*, *::before, *::after": {
                                animationDuration: "0.01ms !important",
                                animationIterationCount: "1 !important",
                                scrollBehavior: "auto !important",
                                transitionDuration: "0.01ms !important"
                            }
                        }
                    }
                },
                MuiLink: {
                    defaultProps: {
                        component: LinkBehavior,
                    } as LinkProps,
                    styleOverrides: {
                        root: {
                            textUnderlineOffset: "3px",
                            textDecorationThickness: "1px"
                        }
                    }
                },
                MuiButtonBase: {
                    defaultProps: {
                        LinkComponent: LinkBehavior,
                    },
                },
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            color: isLight ? "#202027" : "#f4f4f6",
                            backgroundColor: alpha(isLight ? "#ffffff" : "#101016", isLight ? 0.68 : 0.58),
                            backgroundImage: "none",
                            borderBottom: `1px solid ${border}`,
                            boxShadow: isLight ? "0 8px 38px rgba(31, 20, 35, 0.06)" : "0 8px 42px rgba(0, 0, 0, 0.20), 0 1px 0 rgba(236, 59, 131, 0.08)",
                            backdropFilter: "blur(28px) saturate(165%)",
                            WebkitBackdropFilter: "blur(28px) saturate(165%)"
                        }
                    }
                },
                MuiToolbar: {
                    styleOverrides: {
                        root: {
                            minHeight: "68px"
                        }
                    }
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundColor: alpha(surface, isLight ? 0.72 : 0.60),
                            backgroundImage: "none",
                            border: `1px solid ${border}`,
                            backdropFilter: "blur(24px) saturate(145%)",
                            WebkitBackdropFilter: "blur(24px) saturate(145%)",
                            transition: "border-color 220ms ease, box-shadow 220ms ease, background-color 220ms ease",
                            boxShadow: isLight
                                ? "0 1px 2px rgba(20, 20, 30, 0.04), 0 14px 38px rgba(35, 20, 38, 0.055)"
                                : "0 1px 2px rgba(0, 0, 0, 0.20), 0 16px 42px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.035)"
                        }
                    }
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            backgroundColor: alpha(surface, isLight ? 0.74 : 0.62),
                            backgroundImage: "none",
                            border: `1px solid ${border}`,
                            backdropFilter: "blur(24px) saturate(150%)",
                            WebkitBackdropFilter: "blur(24px) saturate(150%)",
                            boxShadow: isLight
                                ? "0 14px 38px rgba(35, 20, 38, 0.055)"
                                : "0 16px 42px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.035)"
                        }
                    }
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 10,
                            textTransform: "none",
                            transition: "transform 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                            "&:active": {
                                transform: "scale(0.975)"
                            }
                        },
                        outlined: {
                            borderColor: alpha(isLight ? "#202027" : "#ffffff", 0.18)
                        }
                    }
                },
                MuiIconButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 10,
                            transition: "transform 180ms ease, background-color 180ms ease, color 180ms ease",
                            "&:active": {
                                transform: "scale(0.92)"
                            }
                        }
                    }
                },
                MuiOutlinedInput: {
                    styleOverrides: {
                        root: {
                            borderRadius: 11,
                            backgroundColor: alpha(surface, isLight ? 0.72 : 0.54),
                            transition: "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: alpha("#ec3b83", 0.55)
                            },
                            "&.Mui-focused": {
                                boxShadow: `0 0 0 3px ${alpha("#ec3b83", 0.13)}, 0 8px 28px ${alpha("#ec3b83", 0.08)}`
                            }
                        },
                        notchedOutline: {
                            borderColor: alpha(isLight ? "#202027" : "#ffffff", 0.14)
                        }
                    }
                },
                MuiMenu: {
                    styleOverrides: {
                        paper: {
                            marginTop: 6,
                            borderRadius: 12
                        },
                        list: {
                            padding: 6
                        }
                    }
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            borderRadius: 8,
                            margin: "2px 0"
                        }
                    }
                },
                MuiBreadcrumbs: {
                    styleOverrides: {
                        root: {
                            color: isLight ? "#73737f" : "#9595a1"
                        },
                        separator: {
                            color: alpha(isLight ? "#202027" : "#ffffff", 0.24)
                        }
                    }
                },
                MuiDataGrid: {
                    styleOverrides: {
                        root: {
                            border: 0,
                            borderRadius: 10,
                            overflow: "hidden"
                        },
                        virtualScroller: {
                            overscrollBehavior: "none"
                        },
                        columnHeaders: {
                            backgroundColor: isLight ? "#f7f7f9" : "#191922",
                            borderBottom: `1px solid ${border}`
                        },
                        columnHeader: {
                            fontWeight: 600
                        },
                        cell: {
                            borderColor: border
                        },
                        row: {
                            transition: "background-color 120ms ease",
                            "&:hover": {
                                backgroundColor: alpha("#ec3b83", isLight ? 0.045 : 0.065)
                            }
                        },
                        footerContainer: {
                            borderColor: border
                        }
                    }
                },
                MuiTooltip: {
                    styleOverrides: {
                        tooltip: {
                            borderRadius: 8,
                            fontSize: "0.75rem",
                            padding: "7px 10px"
                        }
                    }
                },
                MuiPaginationItem: {
                    styleOverrides: {
                        root: {
                            borderRadius: 8,
                            fontWeight: 500
                        }
                    }
                },
                MuiSwitch: {
                    styleOverrides: {
                        root: {
                            marginLeft: 2,
                            marginRight: 2
                        }
                    }
                }
            },
        }
    )}, [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <MainAppBar loggedInUser={loggedInUser} isUserLoading={loggedInUserLoading} disableSettings={settingsOpen} />
            <Box
                component="main"
                display="flex"
                flexGrow={1}
                flexDirection="column"
                width="100%"
                maxWidth="1480px"
                padding={smallScreen ? 1 : 2.5}
                margin="0 auto auto"
            >
                <Box
                    key={location.pathname}
                    display="flex"
                    flexGrow={1}
                    flexDirection="column"
                    sx={{ animation: "pageEnter 360ms cubic-bezier(0.22, 1, 0.36, 1) both" }}
                >
                    <NuqsAdapter>
                        <Outlet context={contextParams}/>
                    </NuqsAdapter>
                </Box>
            </Box>
            <Box component="footer" mt={4} borderTop={1} borderColor="divider">
                <Breadcrumbs separator="·" sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "20px 16px 22px", "& ol": {"justifyContent": "center"}, "& a": {color: "text.secondary", fontSize: "0.875rem"}}}>
                    <Link href="https://www.roblox.com/games/5315046213/bhop" display="flex" underline="hover">
                        bhop
                        <RobloxIcon size={24} color={theme.palette.primary.main} style={{marginLeft: 4}} />
                    </Link>
                    <Link href="https://www.roblox.com/games/5315066937/surf" display="flex" underline="hover">
                        surf
                        <RobloxIcon size={24} color={theme.palette.primary.main} style={{marginLeft: 4}} />
                    </Link>
                    <Link href="https://discord.gg/Fw8E75X" display="flex">
                        <DiscordIcon size={24} color={theme.palette.primary.main} />
                    </Link>
                    <Link href="https://github.com/fiveman1/strafes-site" display="flex">
                        <GithubIcon size={24} color={theme.palette.primary.main} />
                    </Link>
                    <Link href="/terms" display="flex" underline="hover">
                        terms
                    </Link>
                    <Link href="/privacy" display="flex" underline="hover">
                        privacy
                    </Link>
                </Breadcrumbs>
            </Box>
        </ThemeProvider>
    );
}

export default App;
