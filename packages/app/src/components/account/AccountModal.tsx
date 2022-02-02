import { FC, useCallback } from "react";
import styled from "styled-components";
import { useEthers, Rinkeby, useContractCalls, useMulticallAddress, MultiCallABI, ERC20Interface } from "@usedapp/core";
import { addresses } from "@tender/contracts";
import { TransactionsList } from "../transactions";
import { formatEther } from "@ethersproject/units";
import { BigNumber } from "ethers";
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
import stakers from "data/stakers";
import { AddToken } from "./AddToken";
import { FormClose } from "grommet-icons";

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
  const { ethBalance: balance, tenderBalances, lpBalances } = useBalances(account);
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
                      <Table>
                        <TableBody>
                          {Object.values(stakers).map((staker, index) => {
                            return (
                              <TableRow>
                                <TableCell scope="row" border="bottom">
                                  <TokenBalance
                                    data={tenderBalances[index]}
                                    symbol={`t${staker.symbol}`}
                                    image={`/${staker.bwTenderLogo}`}
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
                          {Object.values(stakers).map((staker, index) => {
                            return (
                              <TableRow>
                                <TableCell scope="row" border="bottom">
                                  <TokenBalance
                                    data={lpBalances[index]}
                                    symbol={`t${staker.symbol}`}
                                    image={`/${staker.bwTenderLogo}`}
                                  />
                                </TableCell>
                                <TableCell border="bottom">
                                  <AddToken
                                    address={addresses[staker.name].lpToken}
                                    symbol={`t${staker.symbol}-${staker.symbol}-SWAP`}
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
  data: { balance: BigNumber[] | undefined };
  symbol: string;
  image: string;
}> = ({ data, symbol, image }) => {
  return (
    <Box pad="small" direction="row" align="center" justify="between">
      <FormField margin="none" plain={true} focusIndicator={false}>
        <Box width="medium">
          <TextInput
            type="number"
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
            value={data.balance?.[0] && formatBalance(data.balance[0])}
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

const useBalances = (address: string | null | undefined) => {
  const multicallAddress = useMulticallAddress();
  const stakersArray = Object.values(stakers);
  const tenderBalanceCalls = stakersArray.map((staker) => {
    return (
      address &&
      addresses[staker.name].tenderToken && {
        abi: ERC20Interface,
        address: addresses[staker.name].tenderToken,
        method: "balanceOf",
        args: [address],
      }
    );
  });
  const lpBalanceCalls = stakersArray.map((staker) => {
    return (
      address &&
      addresses[staker.name].lpToken && {
        abi: ERC20Interface,
        address: addresses[staker.name].lpToken,
        method: "balanceOf",
        args: [address],
      }
    );
  });
  const [ethBalanceResult, ...tokenBalanceResults] =
    useContractCalls([
      multicallAddress &&
        address && {
          abi: MultiCallABI,
          address: multicallAddress,
          method: "getEthBalance",
          args: [address],
        },
      ...tenderBalanceCalls,
      ...lpBalanceCalls,
    ]) ?? [];

  const [ethBalance] = ethBalanceResult ?? [];
  const tokenBalances = tokenBalanceResults
    ? tokenBalanceResults.map((res: BigNumber[] | undefined) => {
        return {
          balance: res,
        };
      })
    : [];
  const half = Math.ceil(tokenBalances.length / 2);

  const tenderBalances = tokenBalances.slice(0, half);
  const lpBalances = tokenBalances.slice(-half);
  return {
    ethBalance,
    tenderBalances,
    lpBalances,
  };
};
