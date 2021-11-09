import { FC } from "react";
import { Box, Heading } from "grommet";
import { useAPYData } from "./useAPYData";
import TokenCardMobile from "../token-card/TokenCardMobile";

export const DeploymentsMobile: FC = () => {
  const { stakersWithAPY } = useAPYData();

  return (
    <div
      style={{
        scrollSnapAlign: "start",
        flexShrink: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url("/landing/shad-deployments.jpg"), url('/landing/noise.png')`,
        backgroundBlendMode: "darken",
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "contain, 50px 50px",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          height: "50vh",
          position: "relative",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div style={{ paddingTop: "7rem" }}>
          <Heading style={{ position: "relative", textShadow: "0px 0px 17px #AD01FF", zIndex: 1 }}>Tender APYs</Heading>
        </div>
        <div style={{ position: "absolute", top: 0, left: -50, zIndex: 0 }}>
          <img
            style={{
              height: "200%",
              transformOrigin: "top",
              transform: "scale(0.7)",
            }}
            src={`/landing/hammer.svg`}
          />
        </div>
      </div>
      <Box direction="column" gap="medium">
        <TokenCardMobile key={stakersWithAPY[1].path} {...stakersWithAPY[1]} />
        <TokenCardMobile key={stakersWithAPY[0].path} {...stakersWithAPY[0]} />
        <TokenCardMobile key={stakersWithAPY[3].path} {...stakersWithAPY[3]} />
        <TokenCardMobile key={stakersWithAPY[2].path} {...stakersWithAPY[2]} />
      </Box>
    </div>
  );
};
