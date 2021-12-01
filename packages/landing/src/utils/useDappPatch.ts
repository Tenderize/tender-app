import { useCallback, useState } from "react";
import { usePromiseTransaction } from "@usedapp/core/dist/cjs/src/hooks/usePromiseTransaction";
import { TransactionOptions, useEthers } from "@usedapp/core";
import { Contract, ethers } from "ethers";

export function connectContractToSigner(
  contract: Contract,
  options?: TransactionOptions,
  library?: ethers.providers.Web3Provider
): Contract {
  if (contract.signer) {
    return contract;
  }

  if (options?.signer) {
    return contract.connect(options.signer as any);
  }

  if (library?.getSigner()) {
    return contract.connect(library.getSigner());
  }

  throw new TypeError("No signer available in contract, options or library");
}

export const useContractFunction = (contract: Contract, functionName: string, options?: TransactionOptions) => {
  const { library, chainId } = useEthers();
  const [events, setEvents] = useState<Record<string, any> | undefined>(undefined);

  const { promiseTransaction, state } = usePromiseTransaction(chainId, options);

  const send = useCallback(
    async (...args: any[]) => {
      const contractWithSigner = connectContractToSigner(contract, options, library);
      const sendPromise = contractWithSigner[functionName](...args).then((result: any): Promise<any> => {
        // Need to add chainId here to prevent "TypeError: Unsupported Chain" error message
        result.chainId = chainId;
        return result;
      });

      const receipt: any = await promiseTransaction(sendPromise);

      if (receipt) {
        if (receipt.logs && receipt.logs.length > 0) {
          setEvents(receipt.logs.map((log: any) => contract.interface.parseLog(log)));
        } else {
          setEvents([]);
        }
      }
    },
    [contract, functionName, chainId, promiseTransaction, library, options]
  );

  return { send, state, events };
};
