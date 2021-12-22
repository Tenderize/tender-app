import { FC, useCallback, useEffect, useState } from "react";
import { useEthers, shortenAddress, useLookupAddress, ChainId } from "@usedapp/core";
import { Box, Button, Card, CardHeader, Image, Layer, Spinner, Text, ThemeType } from "grommet";
import styled, { css } from "styled-components";
import { PortisConnector } from "@web3-react/portis-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { AccountModal } from "./AccountModal";
import { normalizeColor } from "grommet/utils";
import { Config, theme } from "@tender/shared/src/index";

export const AccountButton: FC = () => {
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
    const fetchNetworkName = async () => {
      const network = await library?.getNetwork();
      let nameToSet = "";
      if (chainId === 1) {
        nameToSet = "Ethereum";
      } else {
        if (network?.name != null) {
          const [initial, ...rest] = network.name;
          nameToSet = [initial.toUpperCase(), ...rest].join("");
        }
      }
      setNetworkName(nameToSet);
    };

    fetchNetworkName();
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
                  const walletConnector = new WalletConnectConnector({ rpc: Config.CHAIN_URL_MAPPING });
                  walletConnector.addListener("Web3ReactError", onError);
                  await activate(walletConnector, onError);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Portis"
                image={"/portis.svg"}
                handleClick={async (onError: () => void) => {
                  const walletConnector = new PortisConnector({ dAppId: Config.PORTIS_API_KEY, networks: [4] });
                  walletConnector.addListener("Web3ReactError", onError);
                  await activate(walletConnector, onError);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Coinbase Wallet"
                image={"/coinbaseWalletIcon.svg"}
                handleClick={async (onError: () => void) => {
                  const walletConnector = new WalletLinkConnector({ appName: "Tenderize", url: Config.RPC_URL });
                  walletConnector.addListener("Web3ReactError", onError);
                  await activate(walletConnector, onError);
                  handleCloseWalletPicker();
                }}
              />
              <ProviderButton
                label="Fortmatic"
                image={"/fortmatic.svg"}
                handleClick={async (onError: () => void) => {
                  const walletConnector = new FortmaticConnector({ apiKey: Config.FORTMATIC_API_KEY, chainId: 4 });
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
