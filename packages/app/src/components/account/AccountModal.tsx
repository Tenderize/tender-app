import { FC, useCallback } from "react";
import styled from "styled-components";
import { useEthers, useEtherBalance, getChainById, useTokenBalance } from "@usedapp/core";
import { addresses } from "@tender/contracts/src/index";
import { TransactionsList } from "../transactions";
import { constants } from "ethers";
import { ShareIcon } from "../transactions/Icons";
import { Link } from "../base";
import {
  Box,
  Text,
  Layer,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Image,
  Accordion,
  AccordionPanel,
  FormField,
  TextInput,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "grommet";
import { Staker, stakers } from "@tender/shared/src/index";
import { AddToken } from "./AddToken";
import { FormClose } from "grommet-icons";
import { formatBalance } from "components/formatting";

type AccountModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AccountModal: FC<AccountModalProps> = ({ showModal, setShowModal }) => {
  const { account, chainId } = useEthers();
  const balance = useEtherBalance(account);
  const handleClose = useCallback(() => setShowModal(false), []);
  return (
    <>
      {account && chainId && showModal && (
        <LayerWithHiddenScrollbar
          style={{ overflow: "auto" }}
          animation="fadeIn"
          onEsc={handleClose}
          onClickOutside={handleClose}
          margin={{ vertical: "30px" }}
        >
          <Card flex={false} pad={{ horizontal: "large" }} width="large">
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={handleClose}
            />
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
                  <Link
                    href={getChainById(chainId)?.getExplorerAddressLink(account)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
                      <Table>
                        <TableBody>
                          {Object.values(stakers).map((staker) => {
                            return (
                              <TableRow>
                                <TableCell scope="row" border="bottom">
                                  <TokenBalance
                                    tokenAddress={addresses[staker.name].tenderToken}
                                    staker={staker}
                                    symbol={`t${staker.symbol}`}
                                    image={`/${staker.bwTenderLogo}`}
                                    account={account}
                                  />
                                </TableCell>
                                <TableCell border="bottom">
                                  <AddToken
                                    address={addresses[staker.name].tenderToken}
                                    symbol={`t${staker.symbol}`}
                                    image={`/${staker.bwTenderLogo}`}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </AccordionPanel>
                  </Accordion>
                  <Accordion>
                    <AccordionPanel label={"Liquidity Pools"}>
                      <Table>
                        <TableBody>
                          {Object.values(stakers).map((staker) => {
                            return (
                              <TableRow>
                                <TableCell scope="row" border="bottom">
                                  <TokenBalance
                                    staker={staker}
                                    tokenAddress={addresses[staker.name].lpToken}
                                    symbol={`t${staker.symbol}-SWAP`}
                                    image={""}
                                    account={account}
                                  />
                                </TableCell>
                                <TableCell border="bottom">
                                  <AddToken
                                    address={addresses[staker.name].lpToken}
                                    symbol={`t${staker.symbol}-SWAP`}
                                    image={""}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </AccordionPanel>
                    <AccordionPanel label="Transaction History">
                      <TransactionsList />
                    </AccordionPanel>
                  </Accordion>
                </Box>
              </CardBody>
            </Box>
          </Card>
        </LayerWithHiddenScrollbar>
      )}
    </>
  );
};

const TokenBalance: FC<{
  tokenAddress: string;
  symbol: string;
  image: string;
  staker: Staker;
  account: string | undefined | null;
}> = ({ tokenAddress, symbol, staker, image, account }) => {
  const tenderBalance = useTokenBalance(tokenAddress, account, { chainId: staker.chainId }) || constants.Zero;

  return (
    <Box pad="small" direction="row" align="center" justify="between">
      <FormField margin="none" plain={true} focusIndicator={false}>
        <Box width="medium">
          <TextInput
            icon={
              <Box pad="xsmall" direction="row" align="center" gap="small">
                <Image height="35" src={image} />
                <Text>{symbol}</Text>
              </Box>
            }
            readOnly
            plain={true}
            focusIndicator={false}
            style={{ textAlign: "right", padding: "20px 50px" }}
            value={tenderBalance && formatBalance(tenderBalance)}
          />
        </Box>
      </FormField>
    </Box>
  );
};

const LinkIconWrapper = styled.div`
  width: 1.2rem;
  height: 1.2rem;
`;

const LayerWithHiddenScrollbar = styled(Layer)`
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;
