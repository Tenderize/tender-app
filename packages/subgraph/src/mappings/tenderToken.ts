import { Address } from "@graphprotocol/graph-ts"
import { Config, TenderTokenTransferEvent } from "../types/schema"
import { TenderToken, Transfer } from "../types/templates/TenderToken/TenderToken"
import { getProtocolIdByTenderTokenAddress, loadOrCreateUserDeployment, loadOrCreateUserDeploymentDay } from "./utils"

export function handleTransferEvent(transferEvent: Transfer): void {
    let tenderTokenAddress = transferEvent.address.toHex()
    let protocolId  = getProtocolIdByTenderTokenAddress(tenderTokenAddress)
    let config = Config.load(protocolId)
    let tenderToken = TenderToken.bind(Address.fromString(config.tenderToken))
    let amount = transferEvent.params.value

    // Update user data for to/from users
    let fromUser = loadOrCreateUserDeployment(transferEvent.params.from.toHexString(), protocolId)
    let totalUserRewards = tenderToken.balanceOf(transferEvent.params.from).plus(amount).minus(fromUser.tenderizerStake)
    if ( totalUserRewards < amount ){
        fromUser.claimedRewards = fromUser.claimedRewards.plus(totalUserRewards)
        fromUser.tenderizerStake = fromUser.tenderizerStake.minus(amount.minus(totalUserRewards))    
    } else {
        fromUser.claimedRewards = fromUser.claimedRewards.plus(amount)
    }
    fromUser.shares = tenderToken.sharesOf(transferEvent.params.from)
    fromUser.save()

    let toUser = loadOrCreateUserDeployment(transferEvent.params.to.toHexString(), protocolId)
    toUser.tenderizerStake = toUser.tenderizerStake.plus(amount) 
    toUser.shares = tenderToken.sharesOf(transferEvent.params.to)
    toUser.save()

    // Update user day data for sender
    let userDay = loadOrCreateUserDeploymentDay(
        transferEvent.block.timestamp.toI32(), 
        transferEvent.params.from.toHex(), 
        protocolId
    )
    userDay.shares = tenderToken.sharesOf(transferEvent.params.from)
    userDay.save()

    // Update user day data for receiver
    let userDayRec = loadOrCreateUserDeploymentDay(
        transferEvent.block.timestamp.toI32(), 
        transferEvent.params.to.toHex(), 
        protocolId
    )
    userDayRec.shares = tenderToken.sharesOf(transferEvent.params.to)
    userDayRec.save()

    // Save raw event
    let event = new TenderTokenTransferEvent(transferEvent.transaction.hash.toHex());
    event.tenderToken = tenderTokenAddress
    event.from = transferEvent.params.from.toHex()
    event.to = transferEvent.params.to.toHex()
    event.amount = transferEvent.params.value
    event.timestamp = transferEvent.block.timestamp
    event.save()
}