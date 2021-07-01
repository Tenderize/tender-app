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
  getTenderizerIdByTenderizerAddress,
  loadOrCreateUserTenderizerData,
 } from "./utils"

export function handleDepositEvent(depositEvent: Deposit): void {
  let tenderizerAddress = depositEvent.address.toHex()
  let tenderizerId  = getTenderizerIdByTenderizerAddress(tenderizerAddress)

  // Sanity check, tenderizers would generally always be registered
  if(tenderizerId ==  ''){
    // TODO: add log
    return
  }

  // Update Tenderizer deposit total
  let tenderizer = loadOrCreateTenderizer(tenderizerId)
  tenderizer.deposits = tenderizer.deposits.plus(depositEvent.params.amount)
  tenderizer.save()

  // Update User data
  let userData = loadOrCreateUserTenderizerData(depositEvent.params.from.toHex(), tenderizerId)
  userData.deposits = userData.deposits.plus(depositEvent.params.amount)
  userData.save()

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
  let tenderizerId  = getTenderizerIdByTenderizerAddress(tenderizerAddress)

  // Sanity check, tenderizers would generally always be registered
  if(tenderizerId ==  ''){
    // TODO: add log
    return
  }

  // Update Tenderizer deposit total
  let tenderizer = loadOrCreateTenderizer(tenderizerId)
  tenderizer.withdrawals = tenderizer.withdrawals.plus(withdrawEvent.params.amount)
  tenderizer.save()

  // Update User data
  let userData = loadOrCreateUserTenderizerData(withdrawEvent.params.from.toHex(), tenderizerId)
  userData.withdrawals = userData.withdrawals.plus(withdrawEvent.params.amount)
  userData.save()

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
  let tenderizerId  = getTenderizerIdByTenderizerAddress(tenderizerAddress)

  // Sanity check, tenderizers would generally always be registered
  if(tenderizerId ==  ''){
    // TODO: add log
    return
  }

  // Update Tenderizer deposit total
  let tenderizer = loadOrCreateTenderizer(tenderizerId)
  tenderizer.rewards = tenderizer.rewards.plus(rewardsClaimedEvent.params.rewards)
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
  let tenderizerId  = getTenderizerIdByTenderizerAddress(tenderizerAddress)

  // Sanity check, tenderizers would generally always be registered
  if(tenderizerId ==  ''){
    // TODO: add log
    return
  }

  // Update Tenderizer deposit total
  let tenderizer = loadOrCreateTenderizer(tenderizerId)
  tenderizer.protocolFees = tenderizer.protocolFees.plus(protocolFeeCollectedEvent.params.amount)
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
  let tenderizerId  = getTenderizerIdByTenderizerAddress(tenderizerAddress)

  // Sanity check, tenderizers would generally always be registered
  if(tenderizerId ==  ''){
    // TODO: add log
    return
  }

  // Update Tenderizer deposit total
  let tenderizer = loadOrCreateTenderizer(tenderizerId)
  tenderizer.liquidityFees = tenderizer.liquidityFees.plus(liquidityFeeCollectedEvent.params.amount)
  tenderizer.save()

  // Save raw event
  let event = new LiquidityFeeCollectedEvent(liquidityFeeCollectedEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.amount = liquidityFeeCollectedEvent.params.amount
  event.timestamp = liquidityFeeCollectedEvent.block.timestamp
  event.save()
}