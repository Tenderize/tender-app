import { FC } from "react";

import { Box, ResponsiveContext } from "grommet";
import { GrommetWrapper } from "../components/GrommetWrapper";
import { Carousel } from "../components/highlights/carousel/Carousel";
import { IntroMobile } from "../components/highlights/IntroMobile";
import { DeploymentsMobile } from "../components/highlights/DeploymentsMobile";

const Home: FC = () => {
  return (
    <GrommetWrapper
      style={{
        background: "#0B0C0F",
      }}
    >
      <Box>
        <ResponsiveContext.Consumer>
          {() => (
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                overflowX: "hidden",
              }}
            >
              <IntroMobile />
              <DeploymentsMobile />
              <Carousel />
              {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundImage: "url('/landing/noise.png')",
                    backgroundRepeat: "repeat",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      flex: 1,
                      backgroundImage: "url('/landing/noise.png')",
                      backgroundRepeat: "repeat",
                      paddingLeft: "3.5rem",
                      paddingRight: "3.5rem",
                      paddingTop: "5rem",
                    }}
                  >
                    <Box
                      style={{
                        width: 462,
                        height: 698,
                        backgroundImage: `url('/landing/mobile-rewards.svg')`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                      }}
                    ></Box>
                  </Box>
                </div> */}
            </div>
          )}
        </ResponsiveContext.Consumer>
      </Box>
    </GrommetWrapper>
  );
};

export default Home;
