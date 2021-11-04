import { FC } from "react";
import { Box } from "grommet";

export const HighlightContainer: FC<{ item: string }> = ({ children, item }) => {
  return (
    <div
      id={item}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/landing/noise.png')",
        backgroundRepeat: "repeat",
      }}
    >
      <Box
        style={{
          width: "100vw",
          height: "100vh",
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
              backgroundImage: `url('/landing/img-${item}.svg')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </div>
  );
};
