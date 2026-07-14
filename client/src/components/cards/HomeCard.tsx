import React from "react";
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";

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
            transition: "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
            ":hover": {
                transform: "translateY(-3px)",
                borderColor: "primary.main",
                boxShadow: (theme) => theme.palette.mode === "light"
                    ? "0 16px 38px rgba(30, 24, 32, 0.09)"
                    : "0 18px 44px rgba(0, 0, 0, 0.28)"
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
                        sx={{"& svg": {fontSize: 24}}}
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
