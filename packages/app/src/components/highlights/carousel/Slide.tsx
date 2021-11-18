import { Paragraph } from "grommet";
import { FC, ReactNode, useEffect, useRef, useState } from "react";

const useElementOnScreen = (options: IntersectionObserverInit) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackFunction = (entries: any) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const currentRef = containerRef.current;
    const observer = new IntersectionObserver(callbackFunction, options);
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [containerRef, options]);

  return { containerRef, isVisible };
};

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
