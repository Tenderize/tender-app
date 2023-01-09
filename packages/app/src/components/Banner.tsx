import { Box, Text } from "grommet";
import { FC } from "react";

export const Banner: FC<{ message: string }> = ({ message }) => {
  return (
    <Box background="#FFE8B9" height="40px" justify="center" align="center" gap="xsmall" direction="row">
      <Text color="gray" size="small">
        {message}
      </Text>
    </Box>
  );
};
