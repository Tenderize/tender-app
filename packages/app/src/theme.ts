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
  button: {
    primary: {
      extend: `
      background: white;
      color: #4E66DE;
      border: none;
      border-radius: 0px;
      font-family: "IBM Plex Mono";
      transition: 0.3s;
      &:hover{
        background: #4E66DE;
        color: white;
        border: 1px solid white;
      }
      `
    }
  },
  tab: {
    margin: undefined,
    pad: {
      horizontal: "medium",
    },
    active: {
      background: "rgba(0, 0, 0, 0.2)"
    },
    hover: {
      background: "rgba(0, 0, 0, 0.1)"
    },
    background: {
      color: "rgba(0, 0, 0, 0.0)",
    },
    extend: `
      flex: 1 1 0px;
    `,
  },
};
export const theme = deepMerge(grommet, overrideDefaultTheme);
