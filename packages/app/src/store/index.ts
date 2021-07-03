import create from "zustand";
import { TransactionState } from "@usedapp/core";

type State = {
  approvalState: TransactionState;
  setApprovalState: (txState: TransactionState) => void;
};

const useStore = create<State>((set) => ({
  approvalState: "None",
  setApprovalState: (txState) => set((_state) => ({ approvalState: txState })),
}));

export default useStore;
