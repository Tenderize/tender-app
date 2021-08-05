import { Spinner } from "grommet";
import { FC } from "react";

export const ButtonSpinner: FC = () => (
  <Spinner
    border={[
      { side: "all", color: "background-contrast", size: "medium" },
      { side: "right", color: "white", size: "medium" },
      { side: "top", color: "white", size: "medium" },
      { side: "left", color: "white", size: "medium" },
    ]}
    color="white"
  />
);
