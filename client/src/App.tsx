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
import ConsentDialog from "./components/ConsentDialog";

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
        const surface = isLight ? "#ffffff" : "#101112";
        const border = isLight ? "rgba(18, 20, 22, 0.14)" : "rgba(255, 255, 255, 0.10)";

        return createTheme({
            palette: {
                primary: {
                    main: isLight ? "#44505f" : "#aeb9c7",
                    light: "#d7dee7",
                    dark: "#303944",
                    contrastText: isLight ? "#ffffff" : "#08090a"
                },
                secondary: {
                    main: isLight ? "#65758a" : "#8293a8",
                    light: "#b9c4d1",
                    dark: "#455366"
                },
                mode: mode,
                background: {
                    default: isLight ? "#f3f3f2" : "#08090a",
                    paper: surface
                },
                text: {
                    primary: isLight ? "#181a1c" : "#eeeeec",
                    secondary: isLight ? "#666a6e" : "#969a9f"
                },
                divider: border,
                DataGrid: {
                    bg: surface
                }
            },
            shape: {
                borderRadius: 6
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
                        html: { backgroundColor: isLight ? "#f3f3f2" : "#08090a" },
                        body: {
                            backgroundColor: isLight ? "#f3f3f2" : "#08090a"
                        },
                        "#root": {
                            position: "relative",
                            isolation: "isolate",
                            backgroundImage: "none"
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
                            opacity: 0,
                            willChange: "transform"
                        },
                        "#root::before": {
                            top: "-22%",
                            left: "-13%",
                            background: "transparent"
                        },
                        "#root::after": {
                            right: "-15%",
                            bottom: "-30%",
                            background: "transparent"
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
                            from: { opacity: 0 }, to: { opacity: 1 }
                        },
                        "@keyframes cardEnter": {
                            from: { opacity: 0 }, to: { opacity: 1 }
                        },
                        "@keyframes glowPulse": {
                            "0%, 100%": { opacity: 0.55, transform: "scaleX(0.86)" },
                            "50%": { opacity: 1, transform: "scaleX(1.08)" }
                        },
                        "@keyframes routeLoadingBlur": {
                            from: { opacity: 0.18, backdropFilter: "blur(1px)", WebkitBackdropFilter: "blur(1px)" },
                            to: { opacity: 1, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }
                        },
                        "::selection": {
                            backgroundColor: alpha(isLight ? "#44505f" : "#aeb9c7", 0.3)
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
                            color: isLight ? "#181a1c" : "#eeeeec",
                            backgroundColor: isLight ? "#ffffff" : "#0b0c0d",
                            backgroundImage: "none",
                            borderBottom: `1px solid ${border}`,
                            boxShadow: "none"
                        }
                    }
                },
                MuiToolbar: {
                    styleOverrides: {
                        root: {
                            minHeight: "64px"
                        }
                    }
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundColor: surface,
                            backgroundImage: "none",
                            border: `1px solid ${border}`,
                            transition: "border-color 220ms ease, box-shadow 220ms ease, background-color 220ms ease",
                            boxShadow: "none"
                        }
                    }
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            backgroundColor: surface,
                            backgroundImage: "none",
                            border: `1px solid ${border}`,
                            boxShadow: "none"
                        }
                    }
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 5,
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
                            borderRadius: 5,
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
                            borderRadius: 5,
                            backgroundColor: surface,
                            transition: "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: alpha(isLight ? "#44505f" : "#aeb9c7", 0.6)
                            },
                            "&.Mui-focused": {
                                boxShadow: `0 0 0 2px ${alpha(isLight ? "#44505f" : "#aeb9c7", 0.16)}`
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
                            borderRadius: 6,
                            boxShadow: "none"
                        },
                        list: {
                            padding: 6
                        }
                    }
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            borderRadius: 4,
                            margin: "2px 0"
                        }
                    }
                },
                MuiDialog: {
                    styleOverrides: {
                        paper: {
                            borderRadius: 6,
                            boxShadow: "none"
                        }
                    }
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            borderRadius: 5,
                            fontWeight: 600
                        }
                    }
                },
                MuiTabs: {
                    styleOverrides: {
                        indicator: {
                            height: 3,
                            borderRadius: 3,
                            boxShadow: "none"
                        }
                    }
                },
                MuiLinearProgress: {
                    styleOverrides: {
                        root: {
                            backgroundColor: alpha(isLight ? "#44505f" : "#aeb9c7", 0.10)
                        },
                        bar: {
                            boxShadow: "none"
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
                        columnHeaders: {
                            backgroundColor: isLight ? "#eeeeec" : "#151718",
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
                                backgroundColor: alpha(isLight ? "#44505f" : "#aeb9c7", isLight ? 0.06 : 0.07)
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
            <ConsentDialog />
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
            <Box component="footer" mt={4}>
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
