import { FC } from "react";
import { stakers } from "@tender/shared/src/index";
import { useIsCorrectChain } from "utils/useEnsureRinkebyConnect";
import { SwitchNetwork } from "components/account/SwitchNetwork";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { Box } from "grommet";
import { useEthers } from "@usedapp/core";

const ChangeChainWarning: FC<{ protocolName: ProtocolName }> = ({ children, protocolName }) => {
  const { account } = useEthers();

  const requiredChain = stakers[protocolName].chainId;
  const isCorrectChain = useIsCorrectChain(requiredChain);

  return (
    <>
      {!isCorrectChain && account ? (
        <Box pad={{ vertical: "large" }}>
          <SwitchNetwork chainId={requiredChain} protocol={stakers[protocolName].title} />
        </Box>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default ChangeChainWarning;
