import { FC, useState } from "react";
import { Avatar, Box, Button, Text } from "grommet";
import { ChainId, DEFAULT_SUPPORTED_CHAINS, getChainById } from "@usedapp/core";
import { networkAvatar } from "./helpers";

export const addNetwork = async (chainId: number) => {
  let isNetworkAdded = false;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    isNetworkAdded = true;
  } catch (error: any) {
    if (error.code === 4902 && chainId === ChainId.ArbitrumRinkeby) {
      const chainName = DEFAULT_SUPPORTED_CHAINS.find((chain) => chain.chainId === chainId)?.chainName;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: chainName,
            rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
            blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
            nativeCurrency: {
              symbol: "ETH",
              decimals: 18,
            },
          },
        ],
      });
    }
  }

  return isNetworkAdded;
};

export const SwitchNetwork: FC<{ chainId: ChainId; protocol: string }> = ({ chainId, protocol }) => {
  const [isNetworkAdded, setIsNetworkAdded] = useState(false);

  if (isNetworkAdded) {
    return null;
  }

  const chainName = getChainById(chainId || ChainId.Mainnet)?.chainName;

  return (
    <Box justify="center" align="center" direction="column" gap="medium" pad={{ horizontal: "xsmall" }}>
      <Text>
        Tenderize for {protocol} is live on the {chainName} network
      </Text>
      <Button
        secondary
        onClick={async (e) => {
          e.preventDefault();
          const isAdded = await addNetwork(chainId);
          setIsNetworkAdded(isAdded);
        }}
        icon={<Avatar size="medium" src={networkAvatar(chainId)} />}
        label={`Switch to ${chainName}`}
      />
    </Box>
  );
};
