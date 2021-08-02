import { Address } from "@graphprotocol/graph-ts"
import { Config, TenderTokenTransferEvent } from "../types/schema"
import { TenderToken, Transfer } from "../types/templates/TenderToken/TenderToken"
import { getProtocolIdByTenderTokenAddress, loadOrCreateUserDeployment } from "./utils"

export function handleTransferEvent(transferEvent: Transfer): void {
    let tenderTokenAddress = transferEvent.address.toHex()
    let protocolId  = getProtocolIdByTenderTokenAddress(tenderTokenAddress)
    let config = Config.load(protocolId)
    let tenderToken = TenderToken.bind(Address.fromString(config.tenderToken))

    // Update shares for to/from users
    let fromUser = loadOrCreateUserDeployment(transferEvent.params.from.toHexString(), protocolId)
    fromUser.shares = tenderToken.sharesOf(transferEvent.params.from)
    fromUser.save()
    let toUser = loadOrCreateUserDeployment(transferEvent.params.to.toHexString(), protocolId)
    toUser.shares = tenderToken.sharesOf(transferEvent.params.to)
    toUser.save()

    // Save raw event
    let event = new TenderTokenTransferEvent(transferEvent.transaction.hash.toHex());
    event.tenderToken = tenderTokenAddress
    event.from = transferEvent.params.from.toHex()
    event.to = transferEvent.params.to.toHex()
    event.amount = transferEvent.params.value
    event.timestamp = transferEvent.block.timestamp
    event.save()
}