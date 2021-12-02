import { FC } from "react";
import { Box, Heading, Paragraph } from "grommet";
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Heading style={{ textShadow: "0px 0px 17px #AD01FF", zIndex: 1 }}>Tender Tokens</Heading>
      <Paragraph
        textAlign="center"
        margin={{ vertical: "small", horizontal: "medium" }}
        size="medium"
        style={{ fontWeight: 500 }}
      >
        Liquid staking derivatives pegged 1:1 to your staked assets
      </Paragraph>
      <Paragraph textAlign="center" margin={{ vertical: "small", horizontal: "medium" }} size="medium">
        Your TenderToken balance will increase as Tenderize earns staking rewards so you earn yield simply by holding
        them.
      </Paragraph>
      <Box direction="column" pad={{ top: "large" }} gap="medium">
        <TokenCardMobile key={stakersWithAPY[1].path} {...stakersWithAPY[1]} />
        <TokenCardMobile key={stakersWithAPY[0].path} {...stakersWithAPY[0]} />
        <TokenCardMobile key={stakersWithAPY[3].path} {...stakersWithAPY[3]} />
        <TokenCardMobile key={stakersWithAPY[2].path} {...stakersWithAPY[2]} />
      </Box>
    </div>
  );
};
