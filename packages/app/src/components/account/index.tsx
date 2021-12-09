import { FC, useCallback, useEffect, useState } from "react";
import { useEthers, shortenAddress, useLookupAddress } from "@usedapp/core";
import { Box, Button, Card, CardHeader, Image, Layer, Spinner, Text, ThemeType } from "grommet";
import styled, { css } from "styled-components";
import { PortisConnector } from "@web3-react/portis-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { CHAIN_URL_MAPPING, FORTMATIC_API_KEY, PORTIS_API_KEY, RPC_URL } from "../../config";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";

import { AccountModal } from "./AccountModal";
import { normalizeColor } from "grommet/utils";
import { theme } from "../../../../shared/dist/src/index";

export const AccountButton: FC = () => {
  const { account, deactivate, activate, activateBrowserWallet } = useEthers();
  const ens = useLookupAddress();
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showWalletPicker, setShowWalletPicker] = useState(false);

  const handleCloseWalletPicker = useCallback(() => setShowWalletPicker(false), []);
  const handleShowWalletPicker = useCallback(() => setShowWalletPicker(true), []);
  const [activateError, setActivateError] = useState("");
  const { error } = useEthers();
  useEffect(() => {
    if (error) {
      setActivateError(error.message);
    }
  }, [error]);

  const activateWallet = async () => {
    handleShowWalletPicker();
    setActivateError("");
  };

  return (
    <Account>
      <ErrorWrapper>{activateError}</ErrorWrapper>
      <AccountModal showModal={showAccountInfo} setShowModal={setShowAccountInfo} />
      {account ? (
        <>
          <AccountLabel
            primary
            color="light-2"
            style={{ color: normalizeColor("brand", theme) }}
            onClick={() => setShowAccountInfo(!showAccountInfo)}
            label={ens ?? shortenAddress(account)}
          />
          <DisconnectButton onClick={() => deactivate()} label="Disconnect" />
        </>
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
          <Card flex={false} pad="medium" width="medium">
            <CardHeader justify="center">
              <Text size="xlarge">Connect to a Wallet</Text>
            </CardHeader>
            <Box gap="small" pad={{ top: "medium", horizontal: "medium" }}>
              <ProviderButton
                label="MetaMask"
                image={"/MetaMask_Fox.svg"}
                handleClick={async (onError: () => void) => {
                  activateBrowserWallet(onError);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="WalletConnect"
                image={"/walletconnect-logo.svg"}
                handleClick={async (onError: () => void) => {
                  const walletConnector = new WalletConnectConnector({ rpc: CHAIN_URL_MAPPING });
                  walletConnector.addListener("Web3ReactError", onError);
                  await activate(walletConnector, onError);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Portis"
                image={"/portis.svg"}
                handleClick={async (onError: () => void) => {
                  const walletConnector = new PortisConnector({ dAppId: PORTIS_API_KEY, networks: [4] });
                  walletConnector.addListener("Web3ReactError", onError);
                  await activate(walletConnector, onError);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Coinbase Wallet"
                image={"/coinbaseWalletIcon.svg"}
                handleClick={async (onError: () => void) => {
                  const walletConnector = new WalletLinkConnector({ appName: "Tenderize", url: RPC_URL });
                  walletConnector.addListener("Web3ReactError", onError);
                  await activate(walletConnector, onError);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Fortmatic"
                image={"/fortmatic.svg"}
                handleClick={async (onError: () => void) => {
                  const walletConnector = new FortmaticConnector({ apiKey: FORTMATIC_API_KEY, chainId: 4 });
                  walletConnector.addListener("Web3ReactError", onError);
                  await activate(walletConnector, onError);
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

const ProviderButton: FC<{ handleClick: (onError: () => void) => Promise<void>; label: string; image: any }> = ({
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
        await handleClick(() => setIsLoading(false));
        setIsLoading(false);
      }}
    />
  );
};

const ErrorWrapper = styled.div`
  color: #ff3960;
  margin-right: 4rem;
  margin-left: 4rem;
  overflow: auto;
`;

const Account = styled.div`
  display: flex;
  align-items: center;
`;

const AccountLabel = styled(Button)`
  ${({ theme }: { theme: ThemeType }) => css`
    color: ${normalizeColor("brand", theme)};
  `}
  border-radius: 1.8rem;
  margin-right: -2rem;
  padding-right: 4rem;
  padding-left: 0.8rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConnectButton = styled(Button)`
  ${({ theme }: { theme: ThemeType }) => css`
    color: ${normalizeColor("brand", theme)};
  `}
  border-radius: 1.8rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const DisconnectButton = styled(Button)`
  border-radius: 1.8rem;
`;
