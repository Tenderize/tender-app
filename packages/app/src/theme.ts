import { grommet, ThemeType } from "grommet";
import { deepMerge } from "grommet/utils";

const overrideDefaultTheme: ThemeType = {
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
