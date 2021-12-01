export type ScreenSize = "xsmall" | "small" | "medium" | "large" | "xlarge";

export const screenToFontSize = (screenSize: ScreenSize) => {
  switch (screenSize) {
    case "xlarge": {
      return "medium";
    }
    case "large": {
      return "small";
    }
    case "medium": {
      return "small";
    }
    case "small": {
      return "small";
    }
    case "xsmall": {
      return "small";
    }
  }
};
