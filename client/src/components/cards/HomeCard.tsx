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
            height: {xs: "146px", sm: "174px"},
            position: "relative",
            overflow: "hidden",
            animation: "cardEnter 520ms cubic-bezier(0.22, 1, 0.36, 1) both",
            transition: "background-color 180ms ease, border-color 180ms ease",
            ":hover": {
                borderColor: "primary.dark",
                bgcolor: "action.hover"
            }
        }}
    >
        <CardActionArea href={href} sx={{height: "100%", borderRadius: "inherit"}}>
            <CardContent sx={{height: "100%", p: {xs: 2.25, sm: 2.75}, "&:last-child": {pb: {xs: 2.25, sm: 2.75}}}}>
                <Box display="flex" alignItems="center" mb={1.5}>
                    <Box
                        width="44px"
                        height="44px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="5px"
                        color="primary.main"
                        bgcolor="action.hover"
                        sx={{
                            border: 1,
                            borderColor: "divider",
                            transition: "background-color 180ms ease",
                            ".MuiCard-root:hover &": {
                                bgcolor: "action.selected"
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
