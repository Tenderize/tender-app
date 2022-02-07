import { Box, Spinner } from "grommet";
import { FC } from "react";

export const LoadingButtonContent: FC<{ label?: string }> = (props) => (
  <Box style={{ margin: -4 }} direction="row" align="center" justify="center" gap="small">
    <Spinner
      border={[
        { side: "all", color: "background-contrast", size: "medium" },
        { side: "right", color: "white", size: "medium" },
        { side: "top", color: "white", size: "medium" },
        { side: "left", color: "white", size: "medium" },
      ]}
      color="white"
    />
    {props.label}
  </Box>
);
