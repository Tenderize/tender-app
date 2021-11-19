import { Paragraph } from "grommet";
import { FC, ReactNode, useEffect } from "react";
import { useElementOnScreen } from "../../../utils/useElementOnScreen";

export const Slide: FC<{
  name: string;
  index: number;
  heading: ReactNode;
  body: string;
  setVisibleIndex: (v: number) => void;
}> = ({ name, index, heading, body, setVisibleIndex }) => {
  const { containerRef, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });
  useEffect(() => {
    if (isVisible) {
      setVisibleIndex(index);
    }
  }, [isVisible, index, setVisibleIndex]);

  if (containerRef == null) {
    return null;
  }
  return (
    <div
      ref={containerRef}
      id={`slide-${index}`}
      style={{
        scrollSnapAlign: "start",
        flexShrink: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url("/landing/shad-${name}.jpg"), url('/landing/noise.png')`,
        backgroundBlendMode: "darken",
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "contain, 50px 50px",
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
};
