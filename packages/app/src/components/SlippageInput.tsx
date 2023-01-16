import { Box, Button, Text, TextInput } from "grommet";
import { FC } from "react";

export const SlippageInput: FC<{ slippage: number; setSlippage: (v: number) => void; auto: number }> = ({
  slippage,
  setSlippage,
  auto,
}) => {
  return (
    <Box direction="row" justify="end" align="center" gap="small">
      <Text>Set slippage</Text>
      <Button
        size="small"
        label="auto"
        onClick={() => {
          setSlippage(auto);
        }}
      />
      <Box>
        <TextInput
          id="slippage"
          value={slippage}
          width={30}
          maxLength={2}
          style={{ textAlign: "right", padding: "5px 5px", width: 60 }}
          onChange={(e) => setSlippage(Number.parseInt(e.target.value === "" ? "0" : e.target.value))}
        />
      </Box>
      %
    </Box>
  );
};
