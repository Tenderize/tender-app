import { FC, useEffect, useState } from "react";
import {
  Button,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Layer,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextInput,
  Image,
  Text,
  TableHeader,
} from "grommet";

import { FormClose } from "grommet-icons";
import { Queries, stakers } from "@tender/shared/src/index";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { Lock } from "./types";
import {
  blockTimestampToDate,
  daysBetweenBlockTimestamps,
  daysBetweenDates,
  formatBalance,
} from "components/formatting";
import { abis, addresses } from "@tender/contracts/src";
import { Tenderizer } from "@tender/contracts/gen/types";
import { Contract, utils } from "ethers";
import { useEthers } from "@usedapp/core";
import { useWithdraw } from "utils/tenderDepositHooks";
import { useQuery } from "@apollo/client";

type Props = {
  show: boolean;
  locks: Lock[];
  protocolName: ProtocolName;
  onDismiss: () => void;
};

const WithdrawModal: FC<Props> = ({ show, locks, protocolName, onDismiss }) => {
  const staker = stakers[protocolName];
  const symbol = staker.symbol;
  const [locksUpdated, setLocksUpdated] = useState<Lock[]>([]);
  const { library } = useEthers();

  const { withdraw } = useWithdraw(protocolName);

  const requiredChain = stakers[protocolName].chainId;
  const { data: lastGovUnstakeEvent, refetch: refetchLastGovUnstakeEvent } = useQuery<Queries.LastGovernanceUnstake>(
    Queries.GetPendingWithdrawals,
    {
      variables: {
        from: getGov(protocolName).toLowerCase(),
        tenderizer: addresses[protocolName].tenderizer.toLowerCase(),
      },
      context: { chainId: requiredChain },
    }
  );

  useEffect(() => {
    refetchLastGovUnstakeEvent();
  }, [refetchLastGovUnstakeEvent, requiredChain]);

  useEffect(() => {
    const simulateWithdraw = async () => {
      const updatedLocks = await Promise.all(
        locks.map(async (lock) => {
          const tenderizer = addresses[protocolName].tenderizer;
          const contract = new Contract(
            tenderizer,
            new utils.Interface(abis.tenderizer),
            library?.getSigner()
          ) as Tenderizer;
          try {
            await contract.callStatic.withdraw(lock.unstakeLockID);
            return {
              ...lock,
              open: true,
            };
          } catch (error) {
            return {
              ...lock,
              open: false,
            };
          }
        })
      );
      setLocksUpdated(updatedLocks);
    };
    simulateWithdraw();
  }, [library, locks]);

  return (
    <>
      {show && (
        <Layer style={{ overflow: "auto" }} animation="fadeIn" onEsc={onDismiss} onClickOutside={onDismiss}>
          <Card
            flex={false}
            pad={{ vertical: "medium", horizontal: "xlarge" }}
            width="large"
            style={{ position: "relative" }}
          >
            <Button
              style={{ position: "absolute", top: 10, right: 10 }}
              plain
              icon={<FormClose />}
              onClick={onDismiss}
            />
            <CardHeader justify="center" pad="none">
              <Heading level={2} alignSelf="center">
                {`Withdraw ${symbol}`}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box pad={{ top: "medium", horizontal: "large" }} align="center">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell scope="col" border="bottom">
                        Asset
                      </TableCell>
                      <TableCell scope="col" border="bottom">
                        Balance
                      </TableCell>
                      <TableCell scope="col" border="bottom">
                        Unstake
                      </TableCell>
                      <TableCell scope="col" border="bottom">
                        Withdraw
                      </TableCell>
                      <TableCell scope="col" border="bottom" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locksUpdated.map((lock) => {
                      return (
                        <TableRow key={lock.unstakeLockID}>
                          <TableCell scope="row" border="bottom">
                            <Box pad="xsmall" direction="row" align="center" gap="small">
                              <Image height="35" src={`/${staker.bwLogo}`} />
                              <Text>{symbol}</Text>
                            </Box>
                          </TableCell>
                          <TableCell scope="row" border="bottom">
                            <Box direction="row" align="center" justify="between">
                              <Box width="small">
                                <TextInput
                                  style={{ padding: 0 }}
                                  readOnly
                                  plain={true}
                                  focusIndicator={false}
                                  value={formatBalance(lock.amount)}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell border="bottom">
                            <Text>{blockTimestampToDate(lock.timestamp).toLocaleDateString("en-US")}</Text>
                          </TableCell>
                          <TableCell border="bottom">
                            <Text>{getUnlockDateForProtocol(protocolName, lock, lastGovUnstakeEvent)}</Text>
                          </TableCell>
                          <TableCell border="bottom">
                            <Button
                              primary
                              disabled={lock.open === false}
                              style={{ padding: "5px 5px" }}
                              onClick={async (e) => {
                                e.preventDefault();
                                await withdraw(lock.unstakeLockID);
                                onDismiss();
                              }}
                              label="Withdraw"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </CardBody>
            <CardFooter justify="center" pad={{ vertical: "medium" }}></CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
};

export default WithdrawModal;

const getUnlockDateForProtocol = (
  protocolName: ProtocolName,
  lock: Lock,
  govUnstakeEvent: Queries.LastGovernanceUnstake | undefined
): string => {
  if (lock.open) {
    return "Ready";
  }
  switch (protocolName) {
    case "graph": {
      if (govUnstakeEvent != null) {
        const daysSinceLastGovUnstake = daysBetweenBlockTimestamps(
          govUnstakeEvent.unstakeEvents[0].timestamp,
          lock.timestamp
        );
        if (lock.unstakeLockID < govUnstakeEvent.unstakeEvents[0].unstakeLockID) {
          return `${28 - daysSinceLastGovUnstake} days remaining`;
        } else {
          return `${28 + 28 - daysSinceLastGovUnstake} days remaining`;
        }
      } else {
        return "Loading...";
      }
    }
    case "audius": {
      const unstakeDate = blockTimestampToDate(lock.timestamp);
      const unlockDate = new Date(unstakeDate);
      unlockDate.setDate(unstakeDate.getDate() + 7);
      const daysUntilUnlock = daysBetweenDates(unstakeDate, unlockDate);
      if (daysUntilUnlock < 0) {
        return "Ready";
      } else {
        return `${daysUntilUnlock === 0 ? 1 : daysUntilUnlock} days remaining`;
      }
    }
    case "livepeer": {
      const unstakeDate = blockTimestampToDate(lock.timestamp);
      const unlockDate = new Date(unstakeDate);
      unlockDate.setDate(unstakeDate.getDate() + 7);
      const daysUntilUnlock = daysBetweenDates(unstakeDate, unlockDate);
      if (daysUntilUnlock < 0) {
        return "Ready";
      } else {
        return `${daysUntilUnlock === 0 ? 1 : daysUntilUnlock} days remaining`;
      }
    }
    case "matic": {
      const unstakeDate = blockTimestampToDate(lock.timestamp);
      const unlockDate = new Date(unstakeDate);
      unlockDate.setDate(unstakeDate.getDate() + 3);
      const daysUntilUnlock = daysBetweenDates(unstakeDate, unlockDate);
      if (daysUntilUnlock < 0) {
        return "Ready";
      } else {
        return `${daysUntilUnlock === 0 ? 1 : daysUntilUnlock} days remaining`;
      }
    }
  }
};

const getGov = (protocolName: ProtocolName): string => {
  switch (protocolName) {
    case "livepeer": {
      return "0xc1cfab553835d74717c4499793eea6ef198a3031";
    }
    case "audius": {
      return "0x5542b58080FEE48dBE6f38ec0135cE9011519d96";
    }
    case "graph": {
      return "0x5542b58080FEE48dBE6f38ec0135cE9011519d96";
    }
    case "matic": {
      return "0x5542b58080FEE48dBE6f38ec0135cE9011519d96";
    }
  }
};
