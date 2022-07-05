import React, { FC, useCallback, useState } from "react";
import { useEthers, shortenAddress, useLookupAddress, useEtherBalance, ChainId, getChainById } from "@usedapp/core";
import { Avatar, Box, Button, Card, CardHeader, Heading, Image, Layer, Menu, Spinner, Text, ThemeType } from "grommet";
import styled, { css } from "styled-components";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { UAuthConnector } from "@uauth/web3-react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { AccountModal } from "./AccountModal";
import { normalizeColor } from "grommet/utils";
import { theme } from "@tender/shared/src/index";
import { TenderizeConfig } from "types";
import { FormClose } from "grommet-icons";
import { weiToEthWithDecimals } from "utils/amountFormat";
import { networkAvatar } from "./helpers";
import { SafeAppConnector } from "@gnosis.pm/safe-apps-web3-react";
import { constants } from "ethers";

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

  // hook to automatically connect to a safe
  // it will automatically connect to the Safe if it detects that it's loaded in Safe App contex
  React.useEffect(() => {
    const safeMultisigConnector = new SafeAppConnector();
    safeMultisigConnector.getSafeInfo().then((safeInfo) => {
      if (safeInfo.safeAddress !== constants.AddressZero) {
        activate(safeMultisigConnector);
      }
    });
  }, []);

  const etherBal = useEtherBalance(account);

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
              <ProviderButton
                label="Gnosis Safe"
                image={"/gnosisSafe.svg"}
                handleClick={async () => {
                  const safeMultisigConnector = new SafeAppConnector();
                  await activate(safeMultisigConnector);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Unstoppable Domains"
                image={"/unstoppable.jpg"}
                handleClick={async () => {
                  const injected = new InjectedConnector({ supportedChainIds: [1] });

                  const walletconnect = new WalletConnectConnector({
                    rpc: config.chainUrlMapping,
                    qrcode: true,
                  });

                  const uauth = new UAuthConnector({
                    clientID: "9d2070f4-f40e-4008-b6f5-597b403da3a8",
                    redirectUri: `${window.location.origin}${window.location.pathname}`,
                    scope: "openid wallet email:optional humanity_check:optional",
                    postLogoutRedirectUri: "https://app.tenderize.me",
                    connectors: { injected, walletconnect },
                  });

                  await activate(uauth);
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
