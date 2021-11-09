import { FC } from "react";
import { Box, ResponsiveContext } from "grommet";
import Navbar from "../components/nav";
import { GrommetWrapper } from "../components/GrommetWrapper";

const Home: FC = () => {
  return (
    <GrommetWrapper
      style={{
        background: "#0B0C0F",
      }}
    >
      <Box>
        <div
          style={{
            height: "100vh",
            flexDirection: "column",
            scrollSnapType: "y mandatory",
            alignItems: "center",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          <Box style={{ position: "absolute" }}>
            <Navbar />
          </Box>
          <ResponsiveContext.Consumer>
            {() => (
              <>
                <div
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
                        aspectRatio: "3496/2318",
                        backgroundImage: `url('/landing/mobile-rewards.svg')`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                      }}
                    ></Box>
                  </Box>
                </div>
              </>
            )}
          </ResponsiveContext.Consumer>
        </div>
      </Box>
    </GrommetWrapper>
  );
};

export default Home;
