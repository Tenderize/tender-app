import { TransactionStatus } from "@usedapp/core";
import { useEffect } from "react";

export const useResetInputAfterTx = (tx: TransactionStatus, resetInput: (resetInput: string) => void) => {
  useEffect(() => {
    if (tx.status === "Success") {
      resetInput("");
    }
  }, [tx.status]);
};
