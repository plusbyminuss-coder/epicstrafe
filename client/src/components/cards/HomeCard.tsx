import React from "react";
import { Box, Card, CardActionArea, CardContent, Typography, alpha } from "@mui/material";

export interface IHomeCardProps {
    title: string
    icon: React.ReactElement
    description: string
    href: string
}

function HomeCard(props: IHomeCardProps) {
    const { title, icon, description, href } = props;

    return (
    <Card
        elevation={0}
        sx={{
            width: "100%",
            height: {xs: "142px", sm: "168px"},
            position: "relative",
            overflow: "hidden",
            animation: "cardEnter 520ms cubic-bezier(0.22, 1, 0.36, 1) both",
            transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), border-color 260ms ease, box-shadow 260ms ease",
            "&::before": {
                content: '\"\"',
                position: "absolute",
                width: "120px",
                height: "120px",
                top: "-72px",
                right: "-54px",
                borderRadius: "50%",
                background: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.13 : 0.18),
                filter: "blur(20px)",
                transition: "transform 320ms ease, opacity 320ms ease",
                opacity: 0.72,
                pointerEvents: "none"
            },
            ":hover": {
                transform: "translateY(-5px) scale(1.008)",
                borderColor: "primary.main",
                boxShadow: (theme) => theme.palette.mode === "light"
                    ? `0 18px 44px ${alpha(theme.palette.primary.main, 0.12)}`
                    : `0 20px 52px rgba(0, 0, 0, 0.34), 0 0 34px ${alpha(theme.palette.primary.main, 0.12)}`,
                "&::before": {
                    transform: "translate3d(-12px, 12px, 0) scale(1.25)",
                    opacity: 1
                }
            }
        }}
    >
        <CardActionArea href={href} sx={{height: "100%", borderRadius: "inherit"}}>
            <CardContent sx={{height: "100%", p: {xs: 2.25, sm: 2.75}, "&:last-child": {pb: {xs: 2.25, sm: 2.75}}}}>
                <Box display="flex" alignItems="center" mb={1.5}>
                    <Box
                        width="42px"
                        height="42px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="11px"
                        color="primary.main"
                        bgcolor="action.hover"
                        sx={{
                            boxShadow: (theme) => `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.12)}, 0 8px 22px ${alpha(theme.palette.primary.main, 0.10)}`,
                            transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), background-color 260ms ease",
                            ".MuiCard-root:hover &": {
                                transform: "rotate(-4deg) scale(1.08)",
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14)
                            },
                            "& svg": {fontSize: 24}
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography marginLeft={1.25} variant="h6">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" lineHeight={1.55}>
                    {description}
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
    );
}

export default HomeCard;
