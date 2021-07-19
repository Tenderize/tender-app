import { grommet, ThemeType } from "grommet";
import { deepMerge } from "grommet/utils";

const overrideDefaultTheme: ThemeType = {
  global: {
    colors: {
      brand: "#4E66DE",
      "light-1": "#FFFFFF",
    },
    font: {
      family: "IBM Plex Mono",
    },
  },
  button: {
    default: {
      color: "#FFFFFF",
      border: {
        color: "rgba(255,255,255,0)",
        width: "1px",
      },
    },
    primary: {
      background: "white",
      color: "#4E66DE",
      border: {
        color: "rgba(255,255,255,0)",
        width: "1px",
      },
    },
    secondary: {
      background: "#4E66DE",
      color: "#FFFFFF",
      border: {
        color: "rgba(255,255,255,0)",
        width: "1px",
      },
    },
    hover: {
      default: {
        background: "white",
        color: "#4E66DE",
        border: {
          color: "4E66DE",
          width: "1px",
        },
      },
      primary: {
        background: "#4E66DE",
        color: "white",
        border: {
          width: "1px",
          color: "white",
        },
      },
      secondary: {
        background: "white",
        color: "#4E66DE",
        border: {
          color: "4E66DE",
          width: "1px",
        },
      },
    },
    // secondary: {
    //   extend: `
    //   background: #4E66DE;
    //   color: white;
    //   border: none;
    //   border-radius: 0px;
    //   font-family: "IBM Plex Mono";
    //   transition: 0.3s;
    //   &:hover{
    //     background: white;
    //     color: #4E66DE;
    //     border: 1px solid #4E66DE !important;
    //   }`
    // }
  },
  formField: {
    border: false,
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
