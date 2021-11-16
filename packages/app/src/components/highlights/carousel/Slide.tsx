import { Paragraph } from "grommet";
import { FC, ReactNode } from "react";

export const Slide: FC<{ name: string; index: number; heading: ReactNode; body: string }> = ({
  name,
  index,
  heading,
  body,
}) => (
  <div
    id={`slide-${index}`}
    style={{
      scrollSnapAlign: "start",
      flexShrink: 0,
      width: "100vw",
      height: "100vh",
      backgroundImage: `url("/landing/shad-${name}.jpg")`,
      //  backgroundBlendMode: "darken",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {heading}
    <div
      style={{
        height: "30vh",
        position: "relative",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <img
        style={{
          height: "400%",
          transformOrigin: "top",
          transform: "scale(0.25)",
        }}
        src={`/landing/mobile-${name}.svg`}
      />
    </div>
    <Paragraph>{body}</Paragraph>
  </div>
);
