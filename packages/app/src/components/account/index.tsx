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
import { theme } from "../../theme";

const metamask = require("../../images/MetaMask_Fox.svg");
const walletConnect = require("../../images/walletconnect-logo.svg");
const portis = require("../../images/portis.svg");
const coinbase = require("../../images/coinbaseWalletIcon.svg");
const fortmatic = require("../../images/fortmatic.svg");

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
                image={metamask.default}
                handleClick={async () => {
                  activateBrowserWallet();
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="WalletConnect"
                image={walletConnect.default}
                handleClick={async () => {
                  await activate(new WalletConnectConnector({ rpc: CHAIN_URL_MAPPING }));
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Portis"
                image={portis.default}
                handleClick={async () => {
                  await activate(new PortisConnector({ dAppId: PORTIS_API_KEY, networks: [4] }));
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Coinbase Wallet"
                image={coinbase.default}
                handleClick={async () => {
                  await activate(new WalletLinkConnector({ appName: "Tenderize", url: RPC_URL }));
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Fortmatic"
                image={fortmatic.default}
                handleClick={async () => {
                  await activate(new FortmaticConnector({ apiKey: FORTMATIC_API_KEY, chainId: 4 }));
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
        setIsLoading(false);
      }}
    />
  );
};

const ErrorWrapper = styled.div`
  color: #ff3960;
  margin-right: 40px;
  margin-left: 40px;
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
  border-radius: 18px;
  margin-right: -20px;
  padding-right: 40px;
  padding-left: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConnectButton = styled(Button)`
  ${({ theme }: { theme: ThemeType }) => css`
    color: ${normalizeColor("brand", theme)};
  `}
  border-radius: 18px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const DisconnectButton = styled(Button)`
  border-radius: 18px;
`;
