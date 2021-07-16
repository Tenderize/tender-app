import { grommet, ThemeType } from "grommet";
import { deepMerge } from "grommet/utils";

const overrideDefaultTheme: ThemeType = {
  global: {
    colors: {
      brand: "#4E66DE",
    },
    font: {
      family: "IBM Plex Mono",
    },
  },
  button: {
    primary: {
      background: "light-1",
      color: "brand",
      border: undefined,
      font: {
        weight: 700,
      },
      padding: {
        horizontal: "12px",
        vertical: "6px",
      },
    },
    hover: {
      primary: {
        background: {
          color: "light-2",
        },
        color: "brand",
      },
      secondary: {
        border: {
          width: "3px",
        },
        padding: {
          horizontal: "9px",
          vertical: "3px",
        },
      },
    },
    active: {
      background: {
        color: "aliceblue",
      },
      color: "teal",
      secondary: {
        border: {
          color: "transparent",
        },
      },
    },
  },
  tabs: {
    header: {
      extend: `
        justify-content: space-around;
      `,
    },
  },
  tab: {
    margin: undefined,
    pad: {
      horizontal: "medium",
    },
    border: {
      side: "left",
      size: "xsmall",
      color: "dark-3",
      active: {
        color: "dark-3",
      },
      disabled: {
        // color: undefined,
      },
      hover: {
        color: "dark-3",
        // extend: undefined,
      },
    },
    extend: `
      flex: 1;
      align-item: center;
    `,
  },
};
export const theme = deepMerge(grommet, overrideDefaultTheme);
