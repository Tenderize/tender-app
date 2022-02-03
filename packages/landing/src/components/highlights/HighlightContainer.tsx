import { FC, useEffect } from "react";
import { Box } from "grommet";
import { useElementOnScreen } from "../../utils/useElementOnScreen";

export const HighlightContainer: FC<{
  item: string;
  id?: string;
  setVisibleIndex: (v: number) => void;
  index: number;
  showImage?: boolean;
}> = ({ children, item = "", id, setVisibleIndex, index, showImage = true }) => {
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
      id={id || item}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 700,
        backgroundImage: "url('/landing/noise.png')",
        backgroundRepeat: "repeat",
      }}
    >
      <Box
        style={{
          width: "100vw",
          maxWidth: 1200,
          aspectRatio: "3496/2318",
          backgroundImage: `url('/landing/shad-${item}.jpg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          scrollSnapAlign: "start",
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
              backgroundImage: showImage
                ? item === "intro"
                  ? `url('/landing/animated-hero.png'), url('/landing/img-${item}.svg')`
                  : `url('/landing/img-${item}.svg')`
                : undefined,
              backgroundRepeat: "no-repeat",
              backgroundSize: item === "intro" ? "32%, contain" : "contain",
              backgroundPosition: item === "intro" ? "12%, top left" : undefined,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </div>
  );
};
