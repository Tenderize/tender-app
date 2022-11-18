import { FC } from "react";
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
import { stakers } from "@tender/shared/src/index";
import { ProtocolName } from "@tender/shared/src/data/stakers";
import { Lock } from "./types";
import { blockTimestampToDate, formatBalance } from "components/formatting";

type Props = {
  show: boolean;
  locks: Lock[];
  protocolName: ProtocolName;
  onDismiss: () => void;
};

const WithdrawModal: FC<Props> = ({ show, locks, protocolName, onDismiss }) => {
  const staker = stakers[protocolName];
  const symbol = staker.symbol;

  return (
    <>
      {show && (
        <Layer style={{ overflow: "auto" }} animation="fadeIn" onEsc={onDismiss} onClickOutside={onDismiss}>
          <Card
            flex={false}
            pad={{ vertical: "medium", horizontal: "xlarge" }}
            width="xlarge"
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
                        Unstake
                      </TableCell>
                      <TableCell scope="col" border="bottom">
                        Withdraw Date
                      </TableCell>
                      <TableCell scope="col" border="bottom" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locks.map((lock) => {
                      return (
                        <TableRow>
                          <TableCell scope="row" border="bottom">
                            <Box pad="small" direction="row" align="center" justify="between">
                              <Box width="medium">
                                <TextInput
                                  icon={
                                    <Box pad="xsmall" direction="row" align="center" gap="small">
                                      <Image height="35" src={`/${staker.bwLogo}`} />
                                      <Text>{symbol}</Text>
                                    </Box>
                                  }
                                  readOnly
                                  plain={true}
                                  focusIndicator={false}
                                  style={{ textAlign: "right", padding: "20px 50px" }}
                                  value={formatBalance(lock.amount)}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell border="bottom">
                            <Text>{blockTimestampToDate(lock.timestamp).toLocaleDateString("en-US")}</Text>
                          </TableCell>
                          <TableCell border="bottom">
                            <Text>{getUnlockDateForProtocol(protocolName, lock.timestamp)}</Text>
                          </TableCell>
                          <TableCell border="bottom">
                            <Button
                              primary
                              style={{ padding: "5px 5px" }}
                              onClick={async (e) => {
                                e.preventDefault();
                                //   await addToken(address, symbol, image);
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

const getUnlockDateForProtocol = (protocolName: ProtocolName, timestamp: string): string => {
  switch (protocolName) {
    case "audius": {
      const unstakeDate = blockTimestampToDate(timestamp);
      unstakeDate.setDate(unstakeDate.getDate() + 7);
      const endDate = new Date(unstakeDate);
      endDate.setDate(unstakeDate.getDate() + 7);
      if (endDate < new Date()) {
        return "Ready to Withdraw";
      } else {
        return `Between ${unstakeDate.toLocaleDateString("en-US")} and ${unstakeDate.toLocaleDateString("en-US")}`;
      }
    }
    case "graph": {
      const unstakeDate = blockTimestampToDate(timestamp);
      unstakeDate.setDate(unstakeDate.getDate() + 28);
      const endDate = new Date(unstakeDate);
      endDate.setDate(unstakeDate.getDate() + 28);
      if (endDate < new Date()) {
        return "Ready to Withdraw";
      } else {
        return `Between ${unstakeDate.toLocaleDateString("en-US")} and ${unstakeDate.toLocaleDateString("en-US")}`;
      }
    }
    case "livepeer": {
      const unstakeDate = blockTimestampToDate(timestamp);
      unstakeDate.setDate(unstakeDate.getDate() + 7);
      if (unstakeDate < new Date()) {
        return "Ready to Withdraw";
      } else {
        return `Approx. ${unstakeDate.toLocaleDateString("en-US")}`;
      }
    }
    case "matic": {
      const unstakeDate = blockTimestampToDate(timestamp);
      unstakeDate.setDate(unstakeDate.getDate() + 3);
      if (unstakeDate < new Date()) {
        return "Ready to Withdraw";
      } else {
        return `Approx. ${unstakeDate.toLocaleDateString("en-US")}`;
      }
    }
  }
};
