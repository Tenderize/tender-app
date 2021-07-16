import { grommet, ThemeType } from "grommet";
import { deepMerge } from "grommet/utils";

const overrideDefaultTheme: ThemeType = {
  global: {
    font: {
      family: "IBM Plex Mono",
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
    border: undefined,
  },
};
export const theme = deepMerge(grommet, overrideDefaultTheme);
