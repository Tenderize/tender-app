import { Heading } from "grommet";
import Link from "next/link";
import styled from "styled-components";
import { Slide } from "./Slide";

export const Carousel = () => (
  <div
    style={{
      width: "100vw",
      textAlign: "center",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <Slides>
      <Slide
        name="rewards"
        index={1}
        heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Automatic Rewards</Heading>}
        body="In the contemporary world, rewards for better performance and success matter more than the actual achievement
        itself. Indeed, as the global financial crisis showed, rewards were everything for the bankers as they strove
        for more reckless bets and increasing risk taking."
      />
      <Slide
        name="defi"
        index={2}
        heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Connect with DeFi</Heading>}
        body="What we mean by this is that it is okay to reward a high performer for his or her stellar performance but not
        to the point where in the pursuit of rewards, the individual throws caution to the winds and indulges in
        unethical behavior."
      />
      <Slide
        name="lockups"
        index={3}
        heading={<Heading style={{ textShadow: "0px 0px 8px rgba(237, 19, 32, 0.94)" }}>No Lockups</Heading>}
        body="Hence, rewards management has to be seen in the context of what are proper and just rewards and what are
        disproportionate rewards. The point here is that rewards ought to justify the performance and not exceed them."
      />
      <Slide
        name="staking"
        index={4}
        heading={<Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Easy Staking</Heading>}
        body="Because of the system of flawed incentives, rewards were seen to the ultimate prize that was greater than the
        actual process of winning."
      />
    </Slides>
    <div style={{ position: "absolute", bottom: 0, left: "calc(50vw - 1.8rem)" }}>
      <Link href="#slide-1" scroll={false}>
        <Bubble />
      </Link>
      <Link href="#slide-2" scroll={false}>
        <Bubble />
      </Link>
      <Link href="#slide-3" scroll={false}>
        <Bubble />
      </Link>
      <Link href="#slide-4" scroll={false}>
        <Bubble />
      </Link>
    </div>
  </div>
);

const Bubble = styled.a`
  display: inline-flex;
  width: 0.5rem;
  height: 0.5rem;
  background: grey;
  opacity: 50%;
  border-radius: 50%;
  margin: 0.2rem;
  position: relative;
  &:active {
    background: red;
  }
  &:focus {
    background: #000;
  }
`;

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
