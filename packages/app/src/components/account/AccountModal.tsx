import { FC } from "react";
import styled from "styled-components";
import { useEthers, useEtherBalance, Rinkeby, useTokenBalance } from "@usedapp/core";
import { addresses } from "@tender/contracts";
import { TransactionsList } from "../transactions";
import { formatEther } from "@ethersproject/units";
import { BigNumber, constants } from "ethers";
import { ShareIcon } from "../transactions/Icons";
import { Link } from "../base";
import { Box, Text, Layer, Card, CardHeader, CardBody, Heading, Accordion, AccordionPanel } from "grommet";
import stakers from "data/stakers";
import { AddToken } from "./AddToken";

const formatter = new Intl.NumberFormat("en-us", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const formatBalance = (balance: BigNumber | undefined) =>
  formatter.format(parseFloat(formatEther(balance ?? BigNumber.from("0"))));

type AccountModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AccountModal: FC<AccountModalProps> = ({ showModal, setShowModal }) => {
  const { account, chainId } = useEthers();
  const balance = useEtherBalance(account);
  return (
    <>
      {account && chainId && showModal && (
        <Layer
          style={{ overflow: "auto" }}
          animation="fadeIn"
          onEsc={() => setShowModal(false)}
          onClickOutside={() => setShowModal(false)}
        >
          <Card flex={false}>
            <Box pad="medium" gap="medium">
              <CardHeader justify="center" pad="none">
                <Heading level={2} alignSelf="center">
                  Account info
                </Heading>
              </CardHeader>
              <CardBody gap="small">
                <Text size="medium" weight="bold">
                  Address: {account}
                </Text>
                <Box direction="row" justify="between">
                  <Link href={Rinkeby.getExplorerAddressLink("account")} target="_blank" rel="noopener noreferrer">
                    Show on etherscan
                    <LinkIconWrapper>
                      <ShareIcon fill="#FFFFFF" />
                    </LinkIconWrapper>
                  </Link>
                  {window.isSecureContext && (
                    <Link onClick={() => console.log(navigator.clipboard.writeText(account))}>Copy to clipboard</Link>
                  )}
                </Box>
                <Box>
                  <Box
                    direction="row"
                    align="center"
                    justify="between"
                    pad={{ vertical: "12px", left: "6px", right: "12px" }}
                  >
                    <Heading margin={{ vertical: "none" }} level={4}>
                      Balance
                    </Heading>
                    <Text>ETH: {balance && formatBalance(balance)}</Text>
                  </Box>
                  <Accordion>
                    <AccordionPanel label={"Tender Balances"}>
                      {Object.values(stakers).map((staker) => {
                        return (
                          <TokenBalance
                            tokenAddress={addresses[staker.name].tenderToken}
                            symbol={`t${staker.symbol}`}
                            image={`/${staker.bwTenderLogo}`}
                            account={account}
                          />
                        );
                      })}
                    </AccordionPanel>
                  </Accordion>
                  <Accordion>
                    <AccordionPanel label={"LP Balances"}>
                      {Object.values(stakers).map((staker) => {
                        return (
                          <TokenBalance
                            tokenAddress={addresses[staker.name].lpToken}
                            symbol={`t${staker.symbol}/${staker.symbol}`}
                            image={""}
                            account={account}
                          />
                        );
                      })}
                    </AccordionPanel>
                  </Accordion>
                </Box>
                <Box>
                  <TransactionsList />
                </Box>
              </CardBody>
            </Box>
          </Card>
        </Layer>
      )}
    </>
  );
};

const TokenBalance: FC<{ tokenAddress: string; symbol: string; image: string; account: string | undefined | null }> = ({
  tokenAddress,
  symbol,
  image,
  account,
}) => {
  const tenderBalance = useTokenBalance(tokenAddress, account) || constants.Zero;
  return (
    <Box pad="small" direction="row" align="center" justify="between">
      <AddToken address={tokenAddress} symbol={symbol} image={image} />
      <Text>{`${symbol}: ${tenderBalance && formatBalance(tenderBalance)}`}</Text>
    </Box>
  );
};

const LinkIconWrapper = styled.div`
  width: 1.2rem;
  height: 1.2rem;
`;
