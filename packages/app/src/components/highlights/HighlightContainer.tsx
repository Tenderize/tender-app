import { FC } from "react";
import { Box } from "grommet";

export const HighlightContainer: FC<{ count: number }> = ({ children, count }) => {
  return (
    <Box
      style={{
        width: "100vw",
        aspectRatio: "3496/2318",
        backgroundImage: `url('/landing/shad-${count}.jpg')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        scrollSnapAlign: "start",
      }}
    >
      <Box
        style={{
          backgroundImage: "url('/landing/noise.png')",
          backgroundRepeat: "repeat",
        }}
      >
        <Box
          style={{
            width: "100vw",
            aspectRatio: "3496/2318",
            backgroundImage: `url('/landing/img-${count}.svg')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
