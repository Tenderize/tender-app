import { FC, useCallback, useEffect, useState } from "react";
import { useEthers, shortenAddress, useLookupAddress, useEtherBalance } from "@usedapp/core";
import { Box, Button, Card, CardHeader, Heading, Image, Layer, Spinner, Text, ThemeType } from "grommet";
import styled, { css } from "styled-components";
import { PortisConnector } from "@web3-react/portis-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { AccountModal } from "./AccountModal";
import { normalizeColor } from "grommet/utils";
import { theme } from "@tender/shared/src/index";
import { TenderizeConfig } from "types";
import { FormClose } from "grommet-icons";
import { fetchNetworkName } from "../../utils/helpers";
import { weiToEthWithDecimals } from "utils/amountFormat";

export const AccountButton: FC<{ config: TenderizeConfig }> = ({ config }) => {
  const { account, deactivate, activate, activateBrowserWallet, chainId, library } = useEthers();
  const ens = useLookupAddress();
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showWalletPicker, setShowWalletPicker] = useState(false);
  const [networkName, setNetworkName] = useState<string | undefined>();
  const handleCloseWalletPicker = useCallback(() => setShowWalletPicker(false), []);
  const handleShowWalletPicker = useCallback(() => setShowWalletPicker(true), []);

  useEffect(() => {
    fetchNetworkName(library, setNetworkName);
  }, [chainId, library]);

  const activateWallet = async () => {
    handleShowWalletPicker();
  };

  const etherBal = useEtherBalance(account)

  const supportedChainIds = Object.keys(config.chainUrlMapping).map((i) => parseInt(i, 10));

  return (
    <Account>
      <AccountModal showModal={showAccountInfo} setShowModal={setShowAccountInfo} />
      {account ? (
        <Box direction="row" gap="medium">
          <Button style={{ color: normalizeColor("white", theme), borderColor: normalizeColor("brand", theme) }} label={<Text weight={300}>{networkName}</Text>} />
          <Button style={{ color: normalizeColor("white", theme), borderColor: normalizeColor("brand", theme) }} label={<Text weight={300}>{`${weiToEthWithDecimals(etherBal ?? "0", 4)} ETH`}</Text>} />
          <Button
            style={{ color: normalizeColor("white", theme), borderColor: normalizeColor("brand", theme) }}
            onClick={() => setShowAccountInfo(!showAccountInfo)}
            label={<Text weight={300}>{ens ?? shortenAddress(account)}</Text>} 
          />
          <Button secondary onClick={() => deactivate()} label={<Text weight={300}>Disconnect</Text>} />
        </Box>
      ) : (
        <ConnectButton primary color="light-2" onClick={activateWallet} label="Connect" />
      )}
      {showWalletPicker && (
        <Layer
          style={{ overflow: "auto" }}
          animation="fadeIn"
          onEsc={handleCloseWalletPicker}
          onClickOutside={handleCloseWalletPicker}
        >
          <Card flex={false} style={{ position: "relative" }} pad="medium" width="medium">
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={handleCloseWalletPicker}
            />
            <CardHeader justify="center" pad="none">
              <Heading level={2} alignSelf="center">
                Connect Wallet
              </Heading>
            </CardHeader>
            <Box gap="small" pad={{ top: "medium", horizontal: "medium" }}>
              <ProviderButton
                label="MetaMask"
                image={"/MetaMask_Fox.svg"}
                handleClick={async () => {
                  await activateBrowserWallet();
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="WalletConnect"
                image={"/walletconnect-logo.svg"}
                handleClick={async () => {
                  const walletConnector = new WalletConnectConnector({
                    rpc: config.chainUrlMapping,
                    supportedChainIds: supportedChainIds,
                  });
                  await activate(walletConnector);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Portis"
                image={"/portis.svg"}
                handleClick={async () => {
                  const walletConnector = new PortisConnector({
                    dAppId: config.portisApiKey,
                    networks: supportedChainIds,
                  });
                  await activate(walletConnector);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Coinbase Wallet"
                image={"/coinbaseWalletIcon.svg"}
                handleClick={async () => {
                  const walletConnector = new WalletLinkConnector({
                    appName: "Tenderize",
                    supportedChainIds,
                    url: config.chainUrlMapping[4],
                    darkMode: true,
                  });
                  await activate(walletConnector);
                  handleCloseWalletPicker();
                }}
              />
            </Box>
          </Card>
        </Layer>
      )}
    </Account>
  );
};

const ProviderButton: FC<{ handleClick: () => Promise<void>; label: string; image: any }> = ({
  label,
  image,
  handleClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      icon={
        <Box direction="row" justify="between" align="center" pad="small">
          <Text>{label}</Text>
          {isLoading ? (
            <Box>
              <Spinner size="medium" />
            </Box>
          ) : (
            <Image src={image} width={50} height={50} alt={label} />
          )}
        </Box>
      }
      onClick={async () => {
        setIsLoading(true);
        await handleClick();
      }}
    />
  );
};

const Account = styled.div`
  display: flex;
  align-items: center;
`;

const ConnectButton = styled(Button)`
  ${({ theme }: { theme: ThemeType }) => css`
    color: ${normalizeColor("brand", theme)};
  `}
  padding-left: 2rem;
  padding-right: 2rem;
`;
