import { Container } from "@mui/material";
import { Box } from "@mui/system";

export default function LandingPage() {
  return (
    <Box
      component={"div"}
      className="landing_container"
      sx={{
        height: "600px",
        m: 2,
        backgroundColor: "primary.sectionContainer",
        position: "relative",
        borderRadius: 3,
        clipPath:
          "polygon(25% 12%, 75% 12%, 100% 0, 100% 100%, 76% 87%, 19% 87%, 0 87%, 0 0)",
        "&::before": {
          content: '""',
          height: "40px",
          width: "calc(100% - 30px)",
          top: 0,
          left: "50%",
          backgroundColor: "#fff"
        }
      }}></Box>
  );
}
