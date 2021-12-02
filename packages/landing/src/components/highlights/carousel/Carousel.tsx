import { Heading, Paragraph } from "grommet";
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
          body={
            <>
              <Paragraph margin="none">{Copy.DEFI_1}</Paragraph>
              <Paragraph margin={{ top: "small" }}>{Copy.DEFI_2}</Paragraph>
            </>
          }
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="staking"
          index={1}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Easy Staking</Heading>}
          body={
            <>
              <Paragraph margin="none">{Copy.STAKING_1}</Paragraph>
              <Paragraph margin={{ top: "small" }}>{Copy.STAKING_2}</Paragraph>
            </>
          }
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="rewards"
          index={2}
          heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Automatic Rewards</Heading>}
          body={
            <>
              <Paragraph margin="none">{Copy.REWARDS_1}</Paragraph>
              <Paragraph margin={{ top: "small" }}>{Copy.REWARDS_2}</Paragraph>
            </>
          }
        />
        <Slide
          setVisibleIndex={setVisibleIndex}
          name="lockups"
          index={3}
          heading={<Heading style={{ textShadow: "0px 0px 8px rgba(237, 19, 32, 0.94)" }}>No Lockups</Heading>}
          body={
            <>
              <Paragraph margin="none">{Copy.LOCKUPS_1}</Paragraph>
              <Paragraph margin={{ top: "small" }}>{Copy.LOCKUPS_2}</Paragraph>
            </>
          }
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
