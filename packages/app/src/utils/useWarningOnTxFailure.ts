import { TransactionStatus } from "@usedapp/core";
import { useEffect, useState } from "react";

export const useWarningOnTxFailure = (tx: TransactionStatus) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [errorInfo, setErrorInfo] = useState<string>();

  useEffect(() => {
    if (tx.status === "Exception" || tx.status === "Fail") {
      setErrorMessage(`There was a problem preparing your transaction.`);
      setErrorInfo(`${tx.errorMessage}`);
    }
  }, [tx.status]);

  return { errorMessage, errorInfo };
};
