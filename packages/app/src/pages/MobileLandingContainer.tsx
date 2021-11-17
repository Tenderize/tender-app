import { Carousel } from "../components/highlights/carousel/Carousel";
import { DeploymentsMobile } from "../components/highlights/DeploymentsMobile";
import { IntroMobile } from "../components/highlights/IntroMobile";

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
  </div>
);

export default MobileLandingContainer;
