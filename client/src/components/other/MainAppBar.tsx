import React, { useCallback, useState } from "react";
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import { AppBar, ButtonGroup, CircularProgress, Link, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useLocation } from "react-router";
import LoginIcon from '@mui/icons-material/Login';
import { LoginUser } from "shared";
import { useAppBarHeight } from "../../common/states";
import { login } from "../../api/api";
import AccountMenu from "./AccountMenu";
import { PrefetchableRoute, prefetchRouteModule } from "../../routeModules";

interface IMainAppBarProps {
    loggedInUser: LoginUser | undefined
    isUserLoading: boolean
    disableSettings: boolean
}

enum NavigatorPage {
    Home = "Home",
    Users = "Users",
    Maps = "Maps",
    Gloabls = "Globals",
    Ranks = "Ranks",
    Compare = "Compare"
}

function getCurrentPage(path: string) {
    if (path.startsWith("/users")) {
        return NavigatorPage.Users;
    }
    else if (path.startsWith("/maps")) {
        return NavigatorPage.Maps;
    }
    else if (path.startsWith("/rank")) {
        return NavigatorPage.Ranks;
    }
    else if (path.startsWith("/globals")) {
        return NavigatorPage.Gloabls;
    }
    else if (path.startsWith("/compare")) {
        return NavigatorPage.Compare;
    }
    else if (path === "/") {
        return NavigatorPage.Home;
    }
    return undefined;
}

interface IAppMenuProps {
    loggedInUser: LoginUser | undefined
}

function AppLinks(props: IAppMenuProps) {
    const { loggedInUser } = props;
    const location = useLocation();
    const navPage = getCurrentPage(location.pathname);
    const appBarHeight = useAppBarHeight();

    let userLink = "/users";
    if (loggedInUser) {
        userLink += `/${loggedInUser.userId}`
    }

    const linkStyle = (selected: boolean) => ({
        position: "relative",
        minWidth: 86,
        height: Math.min(appBarHeight - 14, 42),
        px: 1.75,
        color: selected ? "text.primary" : "text.secondary",
        background: selected ? "rgba(255, 255, 255, 0.06)" : "transparent",
        fontWeight: selected ? 700 : 500,
        textShadow: "none",
        boxShadow: selected ? "inset 0 0 0 1px rgba(255, 255, 255, 0.06)" : "none",
        transition: "color 200ms ease, background-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
        "&::after": {
            content: '\"\"',
            position: "absolute",
            left: "50%",
            bottom: 3,
            width: selected ? 20 : 0,
            height: 2,
            borderRadius: 2,
            background: "#aeb9c7",
            boxShadow: "none",
            transform: "translateX(-50%)",
            transition: "width 220ms cubic-bezier(0.22, 1, 0.36, 1)"
        },
        "&:hover": {
            color: "text.primary",
            backgroundColor: selected ? undefined : "action.hover",
            boxShadow: "none",
            transform: "none"
        }
    });

    const prefetchProps = (route: PrefetchableRoute) => ({
        onMouseEnter: () => prefetchRouteModule(route),
        onFocus: () => prefetchRouteModule(route),
        onTouchStart: () => prefetchRouteModule(route)
    });

    return (
        <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap={0.375}
            p={0.5}
            border={1}
            borderColor="divider"
            borderRadius="6px"
            sx={{
                background: "transparent",
                boxShadow: "none"
            }}
        >
            <Button href={userLink} {...prefetchProps("users")} disableRipple
                color="inherit"
                sx={linkStyle(navPage === NavigatorPage.Users)}>
                {NavigatorPage.Users}
            </Button>
            <Button href="/globals" {...prefetchProps("globals")} disableRipple
                color="inherit"
                sx={linkStyle(navPage === NavigatorPage.Gloabls)}>
                {NavigatorPage.Gloabls}
            </Button>
            <Button href="/maps" {...prefetchProps("maps")} disableRipple
                color="inherit"
                sx={linkStyle(navPage === NavigatorPage.Maps)}>
                {NavigatorPage.Maps}
            </Button>
            <Button href="/ranks" {...prefetchProps("ranks")} disableRipple
                color="inherit"
                sx={linkStyle(navPage === NavigatorPage.Ranks)}>
                {NavigatorPage.Ranks}
            </Button>
            <Button href="/compare" {...prefetchProps("compare")} disableRipple
                color="inherit"
                sx={linkStyle(navPage === NavigatorPage.Compare)}>
                {NavigatorPage.Compare}
            </Button>
        </Box>
    );
}

function AppMenu(props: IAppMenuProps) {
    const { loggedInUser } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const location = useLocation();
    const navPage = getCurrentPage(location.pathname);

    let userLink = "/users";
    if (loggedInUser) {
        userLink += `/${loggedInUser.userId}`
    }

    const openNavMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const closeNavMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const navMenuWidth = 125;

    return (
        <Box>
            <Button disableRipple sx={{width: navMenuWidth, height: 42, bgcolor: "action.hover", borderColor: "divider", boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)"}} variant="outlined" color="inherit" endIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />} onClick={openNavMenu} >
                {navPage ?? NavigatorPage.Home}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={closeNavMenu} slotProps={{list: {sx: {width: navMenuWidth}}}} >
                <Link href="/" variant="inherit" color="inherit" underline="none">
                    <MenuItem disableRipple onClick={closeNavMenu} selected={navPage === NavigatorPage.Home} >
                        {NavigatorPage.Home}
                    </MenuItem>
                </Link>
                <Link href={userLink} variant="inherit" color="inherit" underline="none">
                    <MenuItem disableRipple onClick={closeNavMenu} selected={navPage === NavigatorPage.Users} >
                        {NavigatorPage.Users}
                    </MenuItem>
                </Link>
                <Link href="/globals" variant="inherit" color="inherit" underline="none">
                    <MenuItem disableRipple onClick={closeNavMenu} selected={navPage === NavigatorPage.Gloabls} >
                        {NavigatorPage.Gloabls}
                    </MenuItem>
                </Link>
                <Link href="/maps" variant="inherit" color="inherit" underline="none">
                    <MenuItem disableRipple onClick={closeNavMenu} selected={navPage === NavigatorPage.Maps} >
                        {NavigatorPage.Maps}
                    </MenuItem>
                </Link>
                <Link href="/ranks" variant="inherit" color="inherit" underline="none">
                    <MenuItem disableRipple onClick={closeNavMenu} selected={navPage === NavigatorPage.Ranks} >
                        {NavigatorPage.Ranks}
                    </MenuItem>
                </Link>
                <Link href="/compare" variant="inherit" color="inherit" underline="none">
                    <MenuItem disableRipple onClick={closeNavMenu} selected={navPage === NavigatorPage.Compare} >
                        {NavigatorPage.Compare}
                    </MenuItem>
                </Link>
            </Menu>
        </Box>
    );
}

function MainAppBar(props: IMainAppBarProps) {
    const { loggedInUser, isUserLoading, disableSettings } = props;
    const smallScreen = useMediaQuery("@media screen and (max-width: 480px)");
    const useAppMenu = useMediaQuery("@media screen and (max-width: 800px)");
    const onLogin = useCallback(async () => {
        const configuredAuthOrigin = import.meta.env.VITE_EXTERNAL_AUTH_ORIGIN as string | undefined;
        const isLocalDevelopment = import.meta.env.DEV && ["localhost", "127.0.0.1"].includes(window.location.hostname);
        if (isLocalDevelopment || configuredAuthOrigin) {


            const authOrigin = (configuredAuthOrigin ?? "https://strafes.fiveman1.net").replace(/\/$/, "");
            window.location.href = `${authOrigin}${window.location.pathname}${window.location.search}`;
            return;
        }

        const url = await login(window.location.pathname.slice(1) + window.location.search);
        if (url) window.location.href = url;
    }, []);

    const outerWidth = smallScreen ? 52 : 132;

    return (
        <AppBar position="sticky">
            <Toolbar sx={{ justifyContent: "space-between", width: "100%", maxWidth: "1450px", mx: "auto", px: {xs: 1.25, sm: 2} }}>
                <Box minWidth={outerWidth} display="flex">
                    <Link href="/" display="flex" alignItems="center" gap={1.25} color="inherit" underline="none" aria-label="strafes home">
                        <Box
                            component="img"
                            src="/android-chrome-192x192.png"
                            height="36px"
                            width="36px"
                            sx={{
                                borderRadius: "5px",
                                filter: "grayscale(1)",
                                opacity: 0.9,
                                transition: "opacity 180ms ease",
                                "&:hover": {
                                    opacity: 1
                                }
                            }}
                        />
                        <Typography
                            sx={{
                                display: {xs: "none", lg: "block"},
                                fontFamily: '"Goldman", sans-serif',
                                fontWeight: 700,
                                letterSpacing: "-0.035em",
                                textShadow: "none"
                            }}
                        >
                            strafes
                        </Typography>
                    </Link>
                </Box>
                {useAppMenu ? <AppMenu loggedInUser={loggedInUser} /> : <AppLinks loggedInUser={loggedInUser} />}
                <Box minWidth={outerWidth} display="flex" justifyContent="flex-end">
                    <ButtonGroup>
                        {loggedInUser ?
                        <AccountMenu user={loggedInUser} disableSettings={disableSettings} />
                        :
                        (isUserLoading ?
                        <Box width="50px" height="50px" padding="5px" display="flex" justifyContent="center" alignItems="center">
                            <CircularProgress size={32} />
                        </Box>
                        :
                        <Button
                            variant="outlined"
                            size={smallScreen ? "small" : "medium"}
                            startIcon={<LoginIcon />}
                            onClick={onLogin}
                            sx={{
                                width: outerWidth,
                                whiteSpace: "nowrap",
                                color: "text.primary",
                                borderColor: "divider",
                                bgcolor: "action.hover",
                                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                                "&:hover": {
                                    borderColor: "primary.main",
                                    bgcolor: "rgba(255, 79, 154, 0.10)",
                                    boxShadow: "0 8px 24px rgba(255, 79, 154, 0.12)"
                                }
                            }}
                        >
                            Login
                        </Button>)}
                    </ButtonGroup>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default MainAppBar;
