import { grommet, ThemeType } from "grommet";
import { deepMerge } from "grommet/utils";

const overrideDefaultTheme: ThemeType = {
  global: {
    colors: {
      brand: "#4E66DE",
      "light-1": "#FFFFFF"
    },
    font: {
      family: "IBM Plex Mono"
    }
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
