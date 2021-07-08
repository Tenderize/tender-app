import { 
  DepositEvent,
  LiquidityFeeCollectedEvent,
  ProtocolFeeCollectedEvent,
  RewardsClaimedEvent,
  WithdrawEvent,
} from "../types/schema";
import { 
  Deposit,
  LiquidityFeeCollected,
  ProtocolFeeCollected,
  RewardsClaimed,
  Withdraw 
} from "../types/templates/Tenderizer/Tenderizer"
import { 
  loadOrCreateTenderizer,
  getProtocolIdByTenderizerAddress,
  loadOrCreateUserTenderizer,
  loadOrCreateTernderizerDay,
  ONE_BI
 } from "./utils"

export function handleDepositEvent(depositEvent: Deposit): void {
  let tenderizerAddress = depositEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)
  let amount = depositEvent.params.amount.toBigDecimal()

  // Sanity check, tenderizers would generally always be registered
  if(protocolId ==  ''){
    // TODO: add log
    return
  }

  // Update User data
  let userData = loadOrCreateUserTenderizer(depositEvent.params.from.toHex(), protocolId)
  userData.deposits = userData.deposits.plus(amount)
  userData.save()

  // Update day data
  let day = loadOrCreateTernderizerDay(depositEvent.block.timestamp.toI32(), protocolId)
  day.deposits = day.deposits.plus(amount)
  day.volume = day.volume.plus(amount)
  day.cumulativeVolume = day.cumulativeVolume.plus(amount)
  day.save()

  // Update Tenderizer data
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.deposits = tenderizer.deposits.plus(amount)
  tenderizer.depositCount = tenderizer.depositCount.plus(ONE_BI)
  tenderizer.currentPrincipal = tenderizer.currentPrincipal.plus(amount)
  tenderizer.save()

  // Save raw event
  let event = new DepositEvent(depositEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.from = depositEvent.params.from.toHex()
  event.amount = depositEvent.params.amount
  event.timestamp = depositEvent.block.timestamp
  event.save()
}

export function handleWithdrawEvent(withdrawEvent: Withdraw): void {
  let tenderizerAddress = withdrawEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)
  let amount = withdrawEvent.params.amount.toBigDecimal()

  // Sanity check, tenderizers would generally always be registered
  if(protocolId ==  ''){
    // TODO: add log
    return
  }

  // Update User data
  let userData = loadOrCreateUserTenderizer(withdrawEvent.params.from.toHex(), protocolId)
  userData.withdrawals = userData.withdrawals.plus(amount)
  userData.save()

  // Update day data
  let day = loadOrCreateTernderizerDay(withdrawEvent.block.timestamp.toI32(), protocolId)
  day.withdrawals = day.withdrawals.plus(amount)
  day.volume = day.volume.minus(amount)
  day.cumulativeVolume = day.cumulativeVolume.minus(amount)
  day.save()

  // Update Tenderizer data
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.withdrawals = tenderizer.withdrawals.plus(amount)
  tenderizer.withdrawalCount = tenderizer.withdrawalCount.plus(ONE_BI)
  tenderizer.currentPrincipal = tenderizer.currentPrincipal.minus(amount)
  tenderizer.save()

  // Save raw event
  let event = new WithdrawEvent(withdrawEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.from = withdrawEvent.params.from.toHex()
  event.amount = withdrawEvent.params.amount
  event.timestamp = withdrawEvent.block.timestamp
  event.save()
}

export function handleRewardsClaimedEvent(rewardsClaimedEvent: RewardsClaimed): void {
  let tenderizerAddress = rewardsClaimedEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)
  let amount = rewardsClaimedEvent.params.rewards.toBigDecimal()

  // Sanity check, tenderizers would generally always be registered
  if(protocolId ==  ''){
    // TODO: add log
    return
  }

  // Update day data
  let day = loadOrCreateTernderizerDay(rewardsClaimedEvent.block.timestamp.toI32(), protocolId)
  day.rewards = day.rewards.plus(amount)
  day.cumulativeRewards = day.cumulativeRewards.plus(amount)
  day.save()
  
  // Update Tenderizer data
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.rewards = tenderizer.rewards.plus(amount)
  tenderizer.rewardCount = tenderizer.rewardCount.plus(ONE_BI)
  tenderizer.currentPrincipal = tenderizer.currentPrincipal.plus(amount)
  tenderizer.save()

  // Save raw event
  let event = new RewardsClaimedEvent(rewardsClaimedEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.rewards = rewardsClaimedEvent.params.rewards
  event.currentPrincipal = rewardsClaimedEvent.params.currentPrincipal
  event.timestamp = rewardsClaimedEvent.block.timestamp
  event.save()
}

export function handleProtocolFeeCollectedEvent(protocolFeeCollectedEvent: ProtocolFeeCollected): void {
  let tenderizerAddress = protocolFeeCollectedEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)

  // Sanity check, tenderizers would generally always be registered
  if(protocolId ==  ''){
    // TODO: add log
    return
  }

  // Update Tenderizer deposit total
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.protocolFees = tenderizer.protocolFees.plus(protocolFeeCollectedEvent.params.amount.toBigDecimal())
  tenderizer.save()

  // Save raw event
  let event = new ProtocolFeeCollectedEvent(protocolFeeCollectedEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.amount = protocolFeeCollectedEvent.params.amount
  event.timestamp = protocolFeeCollectedEvent.block.timestamp
  event.save()
}

export function handleLiquidityFeeCollectedEvent(liquidityFeeCollectedEvent: LiquidityFeeCollected): void {
  let tenderizerAddress = liquidityFeeCollectedEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)

  // Sanity check, tenderizers would generally always be registered
  if(protocolId ==  ''){
    // TODO: add log
    return
  }

  // Update Tenderizer deposit total
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.liquidityFees = tenderizer.liquidityFees.plus(liquidityFeeCollectedEvent.params.amount.toBigDecimal())
  tenderizer.save()

  // Save raw event
  let event = new LiquidityFeeCollectedEvent(liquidityFeeCollectedEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.amount = liquidityFeeCollectedEvent.params.amount
  event.timestamp = liquidityFeeCollectedEvent.block.timestamp
  event.save()
}