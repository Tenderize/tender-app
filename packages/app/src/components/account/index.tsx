import { FC, useCallback, useEffect, useState } from "react";
import { useEthers, shortenAddress, useLookupAddress } from "@usedapp/core";
import { Box, Button, Card, CardHeader, Heading, Image, Layer, Spinner, Text, ThemeType } from "grommet";
import styled, { css } from "styled-components";
import { PortisConnector } from "@web3-react/portis-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { AccountModal } from "./AccountModal";
import { normalizeColor } from "grommet/utils";
import { theme } from "@tender/shared/src/index";
import { TenderizeConfig } from "types";
import { FormClose } from "grommet-icons";
import { fetchNetworkName } from "./helpers";

export const AccountButton: FC<{ config: TenderizeConfig }> = ({ config }) => {
  const { account, deactivate, activate, activateBrowserWallet, error, chainId, library } = useEthers();
  const ens = useLookupAddress();
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showWalletPicker, setShowWalletPicker] = useState(false);
  const [networkName, setNetworkName] = useState<string | undefined>();
  const handleCloseWalletPicker = useCallback(() => setShowWalletPicker(false), []);
  const handleShowWalletPicker = useCallback(() => setShowWalletPicker(true), []);
  const [activateError, setActivateError] = useState("");

  useEffect(() => {
    if (error) {
      setActivateError(error.message);
    }
  }, [error]);

  useEffect(() => {
    fetchNetworkName(library, setNetworkName);
  }, [chainId, library]);

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
          <NetworkLabel color="light-2" style={{ color: normalizeColor("brand", theme) }} label={networkName} />
          <AccountLabel
            color="light-2"
            style={{ color: normalizeColor("brand", theme) }}
            onClick={() => setShowAccountInfo(!showAccountInfo)}
            label={ens ?? shortenAddress(account)}
          />
          <Button onClick={() => deactivate()} label="Disconnect" />
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
                  const walletConnector = new WalletConnectConnector({ rpc: config.chainUrlMapping });
                  await activate(walletConnector);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Portis"
                image={"/portis.svg"}
                handleClick={async () => {
                  const walletConnector = new PortisConnector({ dAppId: config.portisApiKey, networks: [4] });
                  await activate(walletConnector);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Coinbase Wallet"
                image={"/coinbaseWalletIcon.svg"}
                handleClick={async () => {
                  const walletConnector = new WalletLinkConnector({ appName: "Tenderize", url: config.rpcUrl });
                  await activate(walletConnector);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Fortmatic"
                image={"/fortmatic.svg"}
                handleClick={async () => {
                  const walletConnector = new FortmaticConnector({ apiKey: config.fortmaticApiKey, chainId: 4 });
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

const NetworkLabel = styled(Button)`
  ${({ theme }: { theme: ThemeType }) => css`
    color: ${normalizeColor("brand", theme)};
  `}
  margin-right: 1rem;
  margin-left: 1rem;
  padding-right: 1rem;
`;

const AccountLabel = styled(Button)`
  ${({ theme }: { theme: ThemeType }) => css`
    color: ${normalizeColor("brand", theme)};
  `}
  border-bottom-right-radius: 0rem;
  border-top-right-radius: 0rem;
  margin-right: -1.1rem;
`;

const ConnectButton = styled(Button)`
  ${({ theme }: { theme: ThemeType }) => css`
    color: ${normalizeColor("brand", theme)};
  `}
  padding-left: 2rem;
  padding-right: 2rem;
`;
