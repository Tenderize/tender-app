import React, { FC, useCallback, useState } from "react";
import { useEthers, shortenAddress, useLookupAddress, useEtherBalance, ChainId, getChainById } from "@usedapp/core";
import { Avatar, Box, Button, Card, CardHeader, Heading, Image, Layer, Menu, Spinner, Text, ThemeType } from "grommet";
import styled, { css } from "styled-components";
import { PortisConnector } from "@web3-react/portis-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { AccountModal } from "./AccountModal";
import { normalizeColor } from "grommet/utils";
import { theme } from "@tender/shared/src/index";
import { TenderizeConfig } from "types";
import { FormClose } from "grommet-icons";
import { weiToEthWithDecimals } from "utils/amountFormat";
import { networkAvatar } from "./helpers";

export const AccountButton: FC<{ config: TenderizeConfig }> = ({ config }) => {
  const { account, deactivate, activate, activateBrowserWallet, chainId } = useEthers();
  const ens = useLookupAddress();
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showWalletPicker, setShowWalletPicker] = useState(false);
  const handleCloseWalletPicker = useCallback(() => setShowWalletPicker(false), []);
  const handleShowWalletPicker = useCallback(() => setShowWalletPicker(true), []);

  const activateWallet = async () => {
    handleShowWalletPicker();
  };

  const etherBal = useEtherBalance(account);

  const supportedChainIds = Object.keys(config.chainUrlMapping).map((i) => parseInt(i, 10));

  return (
    <Account>
      <AccountModal showModal={showAccountInfo} setShowModal={setShowAccountInfo} />
      {account ? (
        <Box direction="row" gap="medium">
          <Button
            plain
            icon={<Avatar size="small" src={networkAvatar(chainId)} />}
            style={{ color: normalizeColor("white", theme) }}
            label={<Text>{getChainById(chainId || ChainId.Mainnet)?.chainName}</Text>}
          />
          <Button
            style={{ color: normalizeColor("white", theme), borderColor: normalizeColor("brand", theme) }}
            label={<Text>{`${weiToEthWithDecimals(etherBal ?? "0", 4)} ETH`}</Text>}
          />
          <Menu
            style={{ color: normalizeColor("white", theme), borderColor: normalizeColor("brand", theme) }}
            dropProps={{
              align: { top: "bottom", left: "left" },
              margin: { top: "small" },
              round: "xsmall",
            }}
            messages={{
              openMenu: "Open Menu",
              closeMenu: "Close Menu",
            }}
            label={<Text>{ens ?? shortenAddress(account)}</Text>}
            items={[
              { label: "Account Info", onClick: () => setShowAccountInfo(!showAccountInfo) },
              { label: "Disconnect", onClick: () => deactivate() },
            ]}
          />
        </Box>
      ) : (
        <ConnectButton color="light-2" onClick={activateWallet} label="Connect" />
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
`;
