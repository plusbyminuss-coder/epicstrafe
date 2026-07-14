import { useEffect } from "react";
import Box from "@mui/material/Box";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import HomeCard from "./cards/HomeCard";
import PersonIcon from '@mui/icons-material/Person';
import LayersIcon from '@mui/icons-material/Layers';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useOutletContext } from "react-router";
import { ContextParams } from "../common/common";

function Home() {
    const smallScreen = useMediaQuery("@media screen and (max-width: 520px)");
    const { loginUser } = useOutletContext() as ContextParams;
    
    useEffect(() => {
        document.title = "home - strafes"
    }, []);

    let userLink = "/users";
    if (loginUser) {
        userLink += `/${loginUser.userId}`
    }

    return (
    <Box
        padding={smallScreen ? "42px 4px" : "clamp(64px, 10vh, 112px) 12px"}
        display="flex"
        flexGrow={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
    >
        <Box mb={smallScreen ? 4 : 5.5} textAlign="center">
            <Typography
                variant="h2"
                sx={{
                    fontSize: {xs: "3rem", sm: "4.25rem"},
                    lineHeight: 0.95,
                    color: "text.primary",
                    fontFamily: '"Goldman", sans-serif',
                    fontStyle: "normal",
                    letterSpacing: "-0.055em"
                }}
            >
                strafes
            </Typography>
            <Box width="44px" height="3px" borderRadius="3px" bgcolor="primary.main" mx="auto" mt={2} />
        </Box>
        <Grid container spacing={smallScreen ? 1.25 : 2} justifyContent="center" width="100%" maxWidth="1050px">
            <Grid size={{xs: 12, sm: 6, md: 4}}>
                <HomeCard href={userLink} title="Users" icon={<PersonIcon />} description="Search user profiles and times" />
            </Grid>
             <Grid size={{xs: 12, sm: 6, md: 4}}>
                <HomeCard href="/globals" title="Globals" icon={<EmojiEventsIcon />} description="View the latest world records" />
            </Grid>
            <Grid size={{xs: 12, sm: 6, md: 4}}>
                <HomeCard href="/maps" title="Maps" icon={<LayersIcon />} description="Browse maps and view the top times" />
            </Grid>
            <Grid size={{xs: 12, sm: 6, md: 4}}>
                <HomeCard href="/ranks" title="Ranks" icon={<StarIcon />} description="Explore the leaderboards" />
            </Grid>
            <Grid size={{xs: 12, sm: 6, md: 4}}>
                <HomeCard href="/compare" title="Compare" icon={<CompareArrowsIcon />} description="Compare users head-to-head" />
            </Grid>
        </Grid>
    </Box>
    );
}

export default Home;
