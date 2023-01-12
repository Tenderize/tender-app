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
import { blockTimestampToDate, formatBalance } from "components/formatting";
import { abis, addresses } from "@tender/contracts/src";
import { Tenderizer } from "@tender/contracts/gen/types";
import { Contract, utils } from "ethers";
import { useEthers } from "@usedapp/core";
import { useWithdraw } from "utils/tenderDepositHooks";
import { getUnlockDateForProtocol } from "./helpers";

type Props = {
  show: boolean;
  locks: Lock[];
  protocolName: ProtocolName;
  onDismiss: () => void;
  lastProcessUnstakesEvent: Queries.ProcessUnstakesEvent | undefined;
};

const WithdrawModal: FC<Props> = ({ show, locks, protocolName, onDismiss, lastProcessUnstakesEvent }) => {
  const staker = stakers[protocolName];
  const symbol = staker.symbol;
  const [locksUpdated, setLocksUpdated] = useState<Lock[]>([]);
  const { library } = useEthers();
  const { withdraw } = useWithdraw(protocolName);

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
                        ID
                      </TableCell>
                      <TableCell scope="col" border="bottom">
                        Date
                      </TableCell>
                      <TableCell style={{ whiteSpace: "nowrap" }} scope="col" border="bottom">
                        Time Left
                      </TableCell>
                      <TableCell scope="col" border="bottom" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locksUpdated.map((lock) => {
                      return (
                        <TableRow key={lock.unstakeLockID}>
                          <TableCell scope="row" border="bottom">
                            <Box pad="none" direction="row" align="center">
                              <Text>{symbol}</Text>
                            </Box>
                          </TableCell>
                          <TableCell scope="row" border="bottom">
                            <Box direction="row" align="center" justify="between" gap="small">
                              <Image height="35" src={`/${staker.bwLogo}`} />
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
                            <Text>{lock.unstakeLockID}</Text>
                          </TableCell>
                          <TableCell border="bottom">
                            <Text>{blockTimestampToDate(lock.timestamp).toLocaleDateString("en-US")}</Text>
                          </TableCell>
                          <TableCell border="bottom">
                            <Text style={{ whiteSpace: "nowrap" }}>
                              {getUnlockDateForProtocol(protocolName, lock, lastProcessUnstakesEvent)}
                            </Text>
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
