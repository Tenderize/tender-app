import { grommet, ThemeType } from "grommet";
import { deepMerge } from "grommet/utils";

const overrideDefaultTheme: ThemeType = {
  global: {
    colors: {
      brand: "#4E66DE",
      text: "#FFFFFF",
      modalBackground: "#262528",
    },
    font: {
      family: "IBM Plex Mono",
    },
  },
  button: {
    border: {
      color: "brand",
    },
    padding: {
      vertical: "0px",
      horizontal: "0px",
    },
    primary: {
      color: "brand",

      extend: `
      padding: 10px 20px;
      `,
    },
    secondary: {
      color: "brand",
      extend: `
      padding: 10px 20px;
      `,
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
};
export const theme = deepMerge(grommet, overrideDefaultTheme);
