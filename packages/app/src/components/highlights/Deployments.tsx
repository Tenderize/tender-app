import { FC } from "react";
import { Box, Heading } from "grommet";
import { HighlightContainer } from "./HighlightContainer";
import useSWR from "swr";
import { TenderizerDaysType } from "../../queries";
import stakers from "../../data/stakers";
import TokenCard from "../token-card";
import { ScreenSize, screenToFontSize } from "./helper";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const Deployments: FC<{ screenSize: ScreenSize }> = ({ screenSize }) => {
  const { data } = useSWR<TenderizerDaysType>("/api/apy", fetcher);

  const stakersWithAPY = Object.values(stakers).map((staker) => {
    let apyInPoints = 0;
    if (data != null) {
      const dpyData = Array.from(data.tenderizerDays)
        .filter((item) => item.id.includes(staker.subgraphId))
        .slice(0, -1);

      if (dpyData.length === 0) {
        apyInPoints = 0;
      } else {
        const dayStart = parseInt(dpyData[0].id.split("_")[0]);
        const dayEnd = parseInt(dpyData[dpyData.length - 1].id.split("_")[0]);
        const daysElapsed = dayEnd - dayStart + 1;

        const sumDPYInPoints = dpyData.reduce((seedValue, item) => seedValue + parseFloat(item.DPY), 0);

        const yearlyAvarageRate = (sumDPYInPoints / daysElapsed) * 365;
        apyInPoints = Math.pow(1 + yearlyAvarageRate / 365, 365) - 1;
      }
    }
    let apy = (apyInPoints * 100).toFixed(2);
    if (staker.path === "/stakers/graph") {
      apy = "39.74";
    }
    return {
      ...staker,
      apy,
    };
  });

  return (
    <HighlightContainer item="deployments">
      <Box align="center" gap="medium" style={{ position: "relative", marginTop: "10%", minHeight: 650 }}>
        <Box
          style={{
            position: "relative",
            width: 294.5,
            height: 389,
          }}
        >
          <Box
            style={{
              position: "absolute",
              top: 310,
              left: 50,
            }}
          >
            <TokenCard key={stakersWithAPY[1].path} {...stakersWithAPY[1]} />
          </Box>
          <Box
            style={{
              position: "absolute",
              top: 20,
              left: 160,
            }}
          >
            <TokenCard key={stakersWithAPY[0].path} {...stakersWithAPY[0]} />
          </Box>
          <Box
            style={{
              position: "absolute",
              top: 210,
              left: -170,
            }}
          >
            <TokenCard key={stakersWithAPY[3].path} {...stakersWithAPY[3]} />
          </Box>
          <Box
            style={{
              position: "absolute",
              top: -80,
              left: -70,
            }}
          >
            <TokenCard key={stakersWithAPY[2].path} {...stakersWithAPY[2]} />
          </Box>
          <Box
            style={{
              position: "absolute",
              top: 150,
              width: 294.5,
              height: 389,
              backgroundImage: `url('/landing/hammer.svg')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          />
          <Heading
            style={{
              position: "absolute",
              top: 280,
              left: 270,
              width: 300,
              textShadow: "0px 0px 17px rgba(63, 19, 237, 0.88)",
            }}
            size={screenToFontSize(screenSize)}
          >
            Tender APYs
          </Heading>
        </Box>
      </Box>
    </HighlightContainer>
  );
};
