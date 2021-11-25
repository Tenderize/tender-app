import { grommet, ThemeType } from "grommet";
import { deepMerge } from "grommet/utils";

const overrideDefaultTheme: ThemeType = {
  global: {
    breakpoints: {
      xxsmall: {
        value: 350,
      },
      xsmall: {
        value: 375,
      },
      small: {
        value: 568,
      },
      medium: {
        value: 768,
      },
      large: {
        value: 1000,
      },
      xlarge: {
        value: 1000,
      },
    },
    colors: {
      brand: "#4E66DE",
      text: "#FFFFFF",
      modalBackground: "#262528",
      focus: "brand",
      control: "brand",
    },
    elevation: {
      light: {
        none: "none",
        xsmall: "0px 1px 2px rgba(0, 0, 0, 0.20)",
        small: "none",
        medium: "0px 4px 8px rgba(0, 0, 0, 0.0)",
        large: "0px 8px 16px rgba(0, 0, 0, 0.20)",
        xlarge: "0px 12px 24px rgba(0, 0, 0, 0.20)",
      },
      dark: {
        none: "none",
        xsmall: "0px 2px 2px rgba(255, 255, 255, 0.20)",
        small: "none",
        medium: "0px 6px 8px rgba(255, 255, 255, 0.20)",
        large: "0px 8px 16px rgba(255, 255, 255, 0.20)",
        xlarge: "0px 12px 24px rgba(255, 255, 255, 0.20)",
      },
    },
    font: {
      family: "IBM Plex Sans",
      weight: 400
    },
  },
  heading: {
    font: {
      family: "IBM Plex Mono",
    },
    weight: 500,
  },
  button: {
    border: {
      color: "brand",
      radius: "5px",
    },
    default: {
      background: "transparent",
      border: {
        color: "light-2",
        width: "2px",
      },
    },
    primary: {
      background: "brand",
      padding: {
        vertical: "16px",
        horizontal: "36px",
      },
    },
    secondary: {
      font: {
        weight: 500
      },
      background: "transparent",
      border: {
        color: "brand",
        width: "2px",
      },
      padding: {
        vertical: "16px",
        horizontal: "36px",
      },
    },
  },
  card: {
    header: {
      elevation: "none",
    },
    body: {
      elevation: "none",
    },
    container: {
      elevation: "none",
    },
    footer: {
      elevation: "none",
    },
  },

  formField: {
    border: false,
    label: {
      margin: {
        top: "0px",
      },
    },
  },
  layer: {
    background: "modalBackground",
  },
  tab: {
    border: undefined,
    pad: "none",
    margin: "none",
    active: {
      background: "rgba(0, 0, 0, 0.2)",
    },
    hover: {
      background: "rgba(0, 0, 0, 0.1)",
    },
    background: {
      color: "rgba(0, 0, 0, 0.0)",
    },
  },
  tabs: {
    panel: {
      extend: `
      &:active {
        rgba(0, 0, 0, 0.2);
      }
      `,
    },
    header: {
      extend: `
        overflow: hidden;
        border-top-left-radius: 50px;
        border-top-right-radius: 50px;
        min-width: 100%;
        flex: 1 1 auto;
        align-items: stretch;
        & > * {
          min-width: 25%;
        }
      `,
    },
  },
  textInput: {
    extend: `
      height: inherit:
    `,
  },
};
export const theme = deepMerge(grommet, overrideDefaultTheme);
