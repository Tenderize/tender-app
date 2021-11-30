import { Carousel } from "../components/highlights/carousel/Carousel";
import { DeploymentsMobile } from "../components/highlights/DeploymentsMobile";
import { IntroMobile } from "../components/highlights/IntroMobile";
import { MobileBlogContainer } from "../components/medium/MobileBlogContainer";

const MobileLandingContainer = () => (
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
    <MobileBlogContainer />
  </div>
);

export default MobileLandingContainer;
