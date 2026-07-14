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
    // Map href (Material UI) -> to (react-router)
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
        // Potentially reset theme when navigating to/from settings
        setMode(settings.theme);
    }, [settings.theme, settingsOpen]);

    const theme = useMemo(() => {
        const isLight = mode === "light";
        const surface = isLight ? "#ffffff" : "#15151d";
        const border = isLight ? "rgba(28, 28, 38, 0.10)" : "rgba(255, 255, 255, 0.09)";

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
                        html: { backgroundColor: isLight ? "#f5f5f7" : "#0d0d12" },
                        body: {
                            backgroundColor: isLight ? "#f5f5f7" : "#0d0d12",
                            backgroundImage: isLight
                                ? "radial-gradient(circle at 50% -20%, rgba(236, 59, 131, 0.07), transparent 36rem)"
                                : "radial-gradient(circle at 50% -20%, rgba(236, 59, 131, 0.12), transparent 38rem)",
                            backgroundAttachment: "fixed"
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
                            backgroundColor: alpha(isLight ? "#ffffff" : "#101016", isLight ? 0.76 : 0.72),
                            backgroundImage: "none",
                            borderBottom: `1px solid ${border}`,
                            boxShadow: isLight ? "0 8px 32px rgba(20, 20, 30, 0.04)" : "0 8px 32px rgba(0, 0, 0, 0.14)",
                            backdropFilter: "blur(22px) saturate(145%)",
                            WebkitBackdropFilter: "blur(22px) saturate(145%)"
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
                            backgroundColor: alpha(surface, isLight ? 0.82 : 0.74),
                            backgroundImage: "none",
                            border: `1px solid ${border}`,
                            backdropFilter: "blur(16px) saturate(125%)",
                            WebkitBackdropFilter: "blur(16px) saturate(125%)",
                            boxShadow: isLight
                                ? "0 1px 2px rgba(20, 20, 30, 0.04), 0 10px 30px rgba(20, 20, 30, 0.04)"
                                : "0 1px 2px rgba(0, 0, 0, 0.18), 0 12px 34px rgba(0, 0, 0, 0.16)"
                        }
                    }
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            backgroundColor: alpha(surface, isLight ? 0.84 : 0.76),
                            backgroundImage: "none",
                            border: `1px solid ${border}`,
                            backdropFilter: "blur(16px) saturate(125%)",
                            WebkitBackdropFilter: "blur(16px) saturate(125%)"
                        }
                    }
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 10,
                            textTransform: "none"
                        },
                        outlined: {
                            borderColor: alpha(isLight ? "#202027" : "#ffffff", 0.18)
                        }
                    }
                },
                MuiIconButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 10
                        }
                    }
                },
                MuiOutlinedInput: {
                    styleOverrides: {
                        root: {
                            borderRadius: 11,
                            backgroundColor: alpha(surface, isLight ? 0.9 : 0.7),
                            transition: "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: alpha("#ec3b83", 0.55)
                            },
                            "&.Mui-focused": {
                                boxShadow: `0 0 0 3px ${alpha("#ec3b83", 0.13)}`
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
                <NuqsAdapter>
                    <Outlet context={contextParams}/>
                </NuqsAdapter>
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
