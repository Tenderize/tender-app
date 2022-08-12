import { Box, Button, Text } from "grommet";
import { FC } from "react";

export const AmountInputFooter: FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) => (
  <Box direction="row" gap="small">
    <Text>{label}</Text>
    {onClick && (
      <Button plain onClick={onClick}>
        <Text color="brand">(Max)</Text>
      </Button>
    )}
  </Box>
);
