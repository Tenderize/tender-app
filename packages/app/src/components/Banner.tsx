import { Box, Text } from "grommet";
import { FC } from "react";

export const Banner: FC<{ message: string }> = ({ message }) => {
  return (
    <Box background="#3c479b" height="40px" justify="center" align="center" gap="xsmall" direction="row">
      <Text size="small">{message}</Text>
    </Box>
  );
};
