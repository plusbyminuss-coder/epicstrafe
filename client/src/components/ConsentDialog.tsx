import { useCallback, useState } from "react";
import { Box, Button, Dialog, DialogContent, Link, Typography, alpha } from "@mui/material";
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
    const [open, setOpen] = useState(() => !hasAcceptedPolicies());

    const acceptPolicies = useCallback(() => {
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${CONSENT_COOKIE}=${CONSENT_VALUE}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax${secure}`;
        setOpen(false);
    }, []);

    return (
        <Dialog
            open={open}
            disableEscapeKeyDown
            aria-labelledby="policy-consent-title"
            aria-describedby="policy-consent-description"
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: alpha("#05060c", 0.72),
                        backdropFilter: "blur(12px) saturate(125%)",
                        animation: "consentBackdropIn 420ms ease-out both",
                        "@keyframes consentBackdropIn": {
                            from: { opacity: 0, backdropFilter: "blur(0)" },
                            to: { opacity: 1, backdropFilter: "blur(12px) saturate(125%)" }
                        }
                    }
                },
                paper: {
                    sx: {
                        width: "calc(100% - 32px)",
                        maxWidth: 520,
                        m: 2,
                        overflow: "visible",
                        borderRadius: "24px",
                        backgroundImage: (theme) => theme.palette.mode === "light"
                            ? "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(250,245,251,0.91))"
                            : "linear-gradient(145deg, rgba(25,26,40,0.96), rgba(13,14,24,0.94))",
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 32px 100px rgba(0, 0, 0, 0.55), 0 0 60px rgba(255, 79, 154, 0.12)",
                        animation: "consentDialogIn 520ms cubic-bezier(0.16, 1, 0.3, 1) both",
                        "@keyframes consentDialogIn": {
                            from: { opacity: 0, transform: "translateY(28px) scale(0.94)" },
                            to: { opacity: 1, transform: "translateY(0) scale(1)" }
                        }
                    }
                }
            }}
        >
            <DialogContent sx={{ p: { xs: 3, sm: 4.5 }, textAlign: "center", overflow: "visible" }}>
                <Box
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    width={68}
                    height={68}
                    mb={2.5}
                    borderRadius="20px"
                    sx={{
                        color: "primary.light",
                        background: "linear-gradient(135deg, rgba(255, 79, 154, 0.22), rgba(93, 217, 255, 0.13))",
                        border: "1px solid rgba(255, 79, 154, 0.28)",
                        boxShadow: "0 14px 42px rgba(255, 79, 154, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                        animation: "consentIconFloat 3.2s ease-in-out infinite",
                        "@keyframes consentIconFloat": {
                            "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
                            "50%": { transform: "translateY(-5px) rotate(2deg)" }
                        }
                    }}
                >
                    <GppGoodRoundedIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography id="policy-consent-title" variant="h4" component="h1" mb={1.5} fontWeight={700}>
                    Before you continue
                </Typography>
                <Typography id="policy-consent-description" color="text.secondary" lineHeight={1.7} mb={3.5}>
                    Please review and accept our <Link href="/terms" target="_blank" rel="noopener noreferrer" fontWeight={600}>Terms and Conditions</Link> and <Link href="/privacy" target="_blank" rel="noopener noreferrer" fontWeight={600}>Privacy Policy</Link> to use Strafes.
                </Typography>
                <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    onClick={acceptPolicies}
                    sx={{
                        minHeight: 50,
                        borderRadius: "14px",
                        fontSize: "1rem",
                        background: "linear-gradient(110deg, #ff4f9a, #e83882)",
                        boxShadow: "0 12px 30px rgba(255, 79, 154, 0.3)",
                        "&:hover": {
                            background: "linear-gradient(110deg, #ff68a9, #ed438c)",
                            boxShadow: "0 15px 36px rgba(255, 79, 154, 0.4)",
                            transform: "translateY(-1px)"
                        }
                    }}
                >
                    Accept and continue
                </Button>
                <Typography variant="caption" display="block" color="text.secondary" mt={2.25}>
                    Your acceptance is saved for one year on this device.
                </Typography>
            </DialogContent>
        </Dialog>
    );
}

export default ConsentDialog;
