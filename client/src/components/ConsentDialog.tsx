import { useCallback, useEffect, useState } from "react";
import { Box, Button, Link, Paper, Typography } from "@mui/material";
import GppGoodRoundedIcon from "@mui/icons-material/GppGoodRounded";

const CONSENT_COOKIE = "strafes_policy_consent";
const CONSENT_VALUE = "accepted";
const ONE_YEAR = 60 * 60 * 24 * 365;

function hasAcceptedPolicies() {
    return document.cookie
        .split(";")
        .map((cookie) => cookie.trim())
        .some((cookie) => cookie === `${CONSENT_COOKIE}=${CONSENT_VALUE}`);
}

function ConsentDialog() {
    const [accepted, setAccepted] = useState(hasAcceptedPolicies);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (accepted) return;

        const showConsent = () => setOpen(true);
        window.addEventListener("pointermove", showConsent, { once: true, passive: true });

        return () => window.removeEventListener("pointermove", showConsent);
    }, [accepted]);

    const acceptPolicies = useCallback(() => {
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${CONSENT_COOKIE}=${CONSENT_VALUE}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax${secure}`;
        setOpen(false);
        setAccepted(true);
    }, []);

    if (!open || accepted) return null;

    return (
        <Paper
            role="dialog"
            aria-labelledby="policy-consent-title"
            aria-describedby="policy-consent-description"
            elevation={0}
            sx={{
                position: "fixed",
                right: { xs: 2, sm: 3 },
                bottom: { xs: 2, sm: 3 },
                zIndex: (theme) => theme.zIndex.snackbar,
                width: "calc(100% - 32px)",
                maxWidth: 410,
                p: { xs: 2.25, sm: 2.75 },
                borderRadius: "20px",
                backgroundImage: (theme) => theme.palette.mode === "light"
                    ? "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(250,245,251,0.92))"
                    : "linear-gradient(145deg, rgba(25,26,40,0.96), rgba(13,14,24,0.94))",
                border: "1px solid",
                borderColor: "divider",
                backdropFilter: "blur(26px) saturate(165%)",
                boxShadow: "0 22px 70px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 79, 154, 0.1)",
                animation: "consentPopupIn 620ms cubic-bezier(0.16, 1, 0.3, 1) both",
                "@keyframes consentPopupIn": {
                    from: { opacity: 0, transform: "translate3d(28px, 24px, 0) scale(0.94)" },
                    to: { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }
                },
                "@media (prefers-reduced-motion: reduce)": {
                    animationDuration: "0.01ms"
                }
            }}
        >
            <Box display="flex" alignItems="flex-start" gap={1.75}>
                <Box
                    display="flex"
                    flexShrink={0}
                    alignItems="center"
                    justifyContent="center"
                    width={48}
                    height={48}
                    borderRadius="15px"
                    sx={{
                        color: "primary.light",
                        background: "linear-gradient(135deg, rgba(255, 79, 154, 0.22), rgba(93, 217, 255, 0.13))",
                        border: "1px solid rgba(255, 79, 154, 0.28)",
                        boxShadow: "0 10px 30px rgba(255, 79, 154, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.12)"
                    }}
                >
                    <GppGoodRoundedIcon sx={{ fontSize: 27 }} />
                </Box>
                <Box minWidth={0}>
                    <Typography id="policy-consent-title" variant="h6" component="h2" mb={0.5} fontWeight={700}>
                        Privacy and terms
                    </Typography>
                    <Typography id="policy-consent-description" variant="body2" color="text.secondary" lineHeight={1.6}>
                        By continuing, you accept our <Link href="/terms" target="_blank" rel="noopener noreferrer" fontWeight={600}>Terms</Link> and <Link href="/privacy" target="_blank" rel="noopener noreferrer" fontWeight={600}>Privacy Policy</Link>.
                    </Typography>
                </Box>
            </Box>
            <Button
                fullWidth
                variant="contained"
                onClick={acceptPolicies}
                sx={{
                    mt: 2.25,
                    minHeight: 44,
                    borderRadius: "12px",
                    background: "linear-gradient(110deg, #ff4f9a, #e83882)",
                    boxShadow: "0 10px 26px rgba(255, 79, 154, 0.26)",
                    "&:hover": {
                        background: "linear-gradient(110deg, #ff68a9, #ed438c)",
                        boxShadow: "0 13px 32px rgba(255, 79, 154, 0.36)",
                        transform: "translateY(-1px)"
                    }
                }}
            >
                Accept
            </Button>
        </Paper>
    );
}

export default ConsentDialog;
