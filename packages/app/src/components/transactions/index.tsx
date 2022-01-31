import { FC, ReactElement, ReactNode } from "react";
import { Box, Table, TableBody, Text } from "grommet";
import type { TransactionResponse } from "@ethersproject/providers";
import {
  Rinkeby,
  Notification,
  useNotifications,
  useTransactions,
  getStoredTransactionState,
  StoredTransaction,
  shortenTransactionHash,
} from "@usedapp/core";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, ClockIcon, ExclamationIcon, UnwrapIcon, WalletIcon, WrapIcon, SpinnerIcon } from "./Icons";
import { Link } from "../base";
import { ShareRounded } from "grommet-icons";

interface TableWrapperProps {
  children: ReactNode;
}

const TableWrapper = ({ children }: TableWrapperProps) => (
  <Table>
    <TableBody>
      <Box style={{ overflow: "auto" }}>{children}</Box>
    </TableBody>
  </Table>
);

interface DateProps {
  date: number;
}

const DateCell = ({ date }: DateProps) => {
  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleDateString();
  const formattedTime = dateObject.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <DateRow>
      <DateDisplay>{formattedDate}</DateDisplay>
      <HourDisplay>{formattedTime}</HourDisplay>
    </DateRow>
  );
};

const notificationContent: { [key in Notification["type"]]: { title: string; icon: ReactElement } } = {
  transactionFailed: { title: "Transaction failed", icon: <ExclamationIcon fill="white" /> },
  transactionStarted: { title: "Transaction started", icon: <ClockIcon fill="white" /> },
  transactionSucceed: { title: "Transaction succeed", icon: <CheckIcon fill="white" /> },
  walletConnected: { title: "Wallet connected", icon: <WalletIcon fill="white" /> },
};

interface ListElementProps {
  icon: ReactNode;
  title: string | undefined;
  transaction?: TransactionResponse;
  date?: number;
  type: Notification["type"];
}

export const TransactionListElement: FC<Omit<ListElementProps, "type">> = ({ transaction, icon, title, date }) => {
  return (
    <ListElementWrapper layout initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <MaybeLink transaction={transaction}>
        <Box direction="row" gap="small">
          {transaction && <ShareRounded />}
          <TextBold>{title}</TextBold>
        </Box>
      </MaybeLink>
      <Box direction="row">
        {date != null && <NotificationDate date={date} />}
        {icon != null && (
          <ListIconContainer>
            <Text color="white">{icon}</Text>
          </ListIconContainer>
        )}
      </Box>
    </ListElementWrapper>
  );
};

const MaybeLink: FC<{ transaction: TransactionResponse | undefined }> = ({ transaction, children }) => {
  if (transaction != null) {
    return (
      <Link href={Rinkeby.getExplorerTransactionLink(transaction.hash)} target="_blank" rel="noopener noreferrer">
        {children}
      </Link>
    );
  } else {
    return <>{children}</>;
  }
};

function TransactionIcon(transaction: StoredTransaction) {
  if (getStoredTransactionState(transaction) === "Mining") {
    return <SpinnerIcon fill="#FFFFFF" />;
  } else if (getStoredTransactionState(transaction) === "Fail") {
    return <ExclamationIcon fill="#FFFFFF" />;
  } else if (transaction.transactionName === "Unwrap") {
    return <UnwrapIcon fill="#FFFFFF" />;
  } else if (transaction.transactionName === "Wrap") {
    return <WrapIcon fill="#FFFFFF" />;
  } else {
    return <CheckIcon fill="#FFFFFF" />;
  }
}

export const TransactionsList: FC = () => {
  const { transactions } = useTransactions();
  return (
    <TableWrapper>
      <AnimatePresence initial={false}>
        {transactions.map((transaction) => (
          <TransactionListElement
            transaction={transaction.transaction}
            title={transaction.transactionName}
            icon={TransactionIcon(transaction)}
            key={transaction.transaction.hash}
            date={transaction.submittedAt}
          />
        ))}
      </AnimatePresence>
    </TableWrapper>
  );
};

const useNotificationBackground = (notification: Notification["type"]) => {
  if (notification === "transactionFailed") return "#FF4040";
  if (notification === "transactionSucceed") return "#00C781";
  return "#777777";
};
const NotificationElement: FC<ListElementProps> = ({ transaction, icon, title, type }) => {
  return (
    <NotificationWrapper layout initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <MaybeLink transaction={transaction}>
        <Box
          direction="row"
          background={useNotificationBackground(type)}
          pad={{ horizontal: "20px", vertical: "10px" }}
          round="20px"
        >
          <NotificationIconContainer>{icon}</NotificationIconContainer>
          <NotificationDetailsWrapper>
            <NotificationText>{title}</NotificationText>
            {transaction && <ShareRounded />}
            <TransactionDetails>
              {transaction && `${shortenTransactionHash(transaction?.hash)} #${transaction.nonce}`}
            </TransactionDetails>
          </NotificationDetailsWrapper>
        </Box>
      </MaybeLink>
    </NotificationWrapper>
  );
};

export const NotificationsList: FC = () => {
  const { notifications } = useNotifications();
  return (
    <NotificationsWrapper>
      <AnimatePresence initial={false}>
        {notifications.map((notification) => {
          if ("transaction" in notification)
            return (
              <NotificationElement
                key={notification.id}
                icon={notificationContent[notification.type].icon}
                title={`${notificationContent[notification.type].title}: ${notification.transactionName}`}
                transaction={notification.transaction}
                date={Date.now()}
                type={notification.type}
              />
            );
          else
            return (
              <NotificationElement
                key={notification.id}
                icon={notificationContent[notification.type].icon}
                title={notificationContent[notification.type].title}
                date={Date.now()}
                type={notification.type}
              />
            );
        })}
      </AnimatePresence>
    </NotificationsWrapper>
  );
};

const TextBold = styled(Text)`
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
`;

const NotificationText = styled(TextBold)`
  font-size: 20px;
  margin-bottom: 5px;
`;

const TransactionDetails = styled.div`
  font-size: 14px;
`;

const NotificationWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  width: 395px;
  border-radius: 10px;
  margin: 15px;
  padding: 10px 20px 10px 20px;
  z-index: 99;
`;

const NotificationsWrapper = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
`;

const NotificationIconContainer = styled.div`
  width: 60px;
  height: 60px;
  padding: 0px;
  margin-right: 20px;
`;

const ListIconContainer = styled.div`
  width: 24px;
  height: 24px;
  padding: 12px;
  padding: 14px 16px 14px 12px;
`;

const ListElementWrapper = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0;
`;

const DateRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: end;
  padding: 8px;
`;

const NotificationDate = styled(DateCell)`
  margin-left: auto;
`;

const DateDisplay = styled.div`
  font-size: 14px;
`;
const HourDisplay = styled.div`
  font-size: 12px;
  color: gray;
`;
