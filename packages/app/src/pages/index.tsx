import { FC } from "react";
import { Box, ResponsiveContext } from "grommet";
import Navbar from "../components/nav";
import { GrommetWrapper } from "../components/GrommetWrapper";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "../components/carousel/Carousel";

const Home: FC = () => {
  return (
    <GrommetWrapper
      style={{
        background: "#0B0C0F",
      }}
    >
      <Box>
        <Box style={{ position: "absolute" }}>
          <Navbar />
        </Box>
        <ResponsiveContext.Consumer>
          {() => (
            <div style={{ display: "flex", flex: 1 }}>
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
