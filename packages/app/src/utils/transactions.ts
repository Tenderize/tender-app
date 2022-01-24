import { TransactionStatus } from "@usedapp/core"

export const isPendingTransaction = (tx: TransactionStatus) => {
    switch(tx.status){
        case "Mining": return true
        case "PendingSignature": return true
        default: return false
    }
}

export const isSuccesfulTransaction = (tx: TransactionStatus) => {
    switch(tx.status) {
        case "Success": return true
        default: return false
    }
}