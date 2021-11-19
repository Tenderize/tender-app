import { Heading } from "grommet";
import { FC, useRef, useState } from "react";
import styled from "styled-components";
import Foot from "../../footer";
import { ScrollIndicator } from "./ScrollIndicator";
import { Slide } from "./Slide";

export const Carousel: FC = () => {
  const target = useRef<HTMLDivElement>();
  const [visibleIndex, setVisibleIndex] = useState(0);
  return (
    <div
      style={{
        width: "100vw",
        textAlign: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Slides ref={target}>
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="rewards"
          index={0}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Automatic Rewards</Heading>}
          body="In the contemporary world, rewards for better performance and success matter more than the actual achievement
        itself. Indeed, as the global financial crisis showed, rewards were everything for the bankers as they strove
        for more reckless bets and increasing risk taking."
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="defi"
          index={1}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Connect with DeFi</Heading>}
          body="What we mean by this is that it is okay to reward a high performer for his or her stellar performance but not
        to the point where in the pursuit of rewards, the individual throws caution to the winds and indulges in
        unethical behavior."
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="lockups"
          index={2}
          heading={<Heading style={{ textShadow: "0px 0px 8px rgba(237, 19, 32, 0.94)" }}>No Lockups</Heading>}
          body="Hence, rewards management has to be seen in the context of what are proper and just rewards and what are
        disproportionate rewards. The point here is that rewards ought to justify the performance and not exceed them."
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="staking"
          index={3}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Easy Staking</Heading>}
          body="Because of the system of flawed incentives, rewards were seen to the ultimate prize that was greater than the
        actual process of winning."
        />
      </Slides>
      <ScrollIndicator count={4} active={visibleIndex} direction="row" />
      <Foot />
    </div>
  );
};

const Slides = styled.div`
  display: flex;

  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;

  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;
