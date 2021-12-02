import { Heading } from "grommet";
import { FC, useRef, useState } from "react";
import styled from "styled-components";
import { Copy } from "../constants";
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
          name="defi"
          index={0}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Connect with DeFi</Heading>}
          body={Copy.DEFI}
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="staking"
          index={1}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Easy Staking</Heading>}
          body={Copy.STAKING}
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="rewards"
          index={2}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Automatic Rewards</Heading>}
          body={Copy.REWARDS}
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="lockups"
          index={3}
          heading={<Heading style={{ textShadow: "0px 0px 8px rgba(237, 19, 32, 0.94)" }}>No Lockups</Heading>}
          body={Copy.LOCKUPS}
        />

      </Slides>
      <ScrollIndicator count={4} active={visibleIndex} direction="row" />
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
