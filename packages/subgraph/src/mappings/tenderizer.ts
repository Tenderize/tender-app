import { 
  Config,
  DepositEvent,
  LiquidityFeeCollectedEvent,
  ProtocolFeeCollectedEvent,
  RewardsClaimedEvent,
  UnstakeEvent,
  ProcessUnstakesEvent,

  WithdrawEvent,
} from "../types/schema";
import { 
  Deposit,
  LiquidityFeeCollected,
  ProtocolFeeCollected,
  RewardsClaimed,
  ProcessUnstakes,
  Unstake,
  Withdraw 
} from "../types/templates/Tenderizer/Tenderizer"
import { 
  loadOrCreateTenderizer,
  getProtocolIdByTenderizerAddress,
  loadOrCreateUserDeployment,
  loadOrCreateTernderizerDay,
  BI_18,
  exponentToBigDecimal,
  getUSDPrice,
  loadOrCreateUserDeploymentDay,
  ZERO_BD
 } from "./utils"
import { TenderToken } from "../types/templates/Tenderizer/TenderToken"
import { Address, BigInt } from "@graphprotocol/graph-ts";

export function handleDepositEvent(depositEvent: Deposit): void {
  let tenderizerAddress = depositEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)
  let amount = depositEvent.params.amount
  let usdPrice = getUSDPrice(Config.load(protocolId).steak)
  let config = Config.load(protocolId)
  let tenderToken = TenderToken.bind(Address.fromString(config.tenderToken))
  let timestamp = depositEvent.block.timestamp.toI32()
  let userAddress = depositEvent.params.from.toHex()

  // Update User data
  let userData = loadOrCreateUserDeployment(userAddress, protocolId)
  userData.tenderizerStake = userData.tenderizerStake.plus(amount)
  userData.shares = tenderToken.sharesOf(depositEvent.params.from)
  userData.save()

  // Update User day data
  let userDay = loadOrCreateUserDeploymentDay(timestamp, userAddress, protocolId)
  userDay.shares = tenderToken.sharesOf(depositEvent.params.from)
  userDay.save()

  // Update day data
  let day = loadOrCreateTernderizerDay(timestamp, protocolId)
  day.deposits = day.deposits.plus(amount)
  day.save()

  // Update Tenderizer data
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.deposits = tenderizer.deposits.plus(amount)
  tenderizer.currentPrincipal = tenderizer.currentPrincipal.plus(amount)
  tenderizer.TVL = tenderizer.currentPrincipal.divDecimal(exponentToBigDecimal(BI_18)).times(usdPrice)
  tenderizer.save()

  // Save raw event
  let event = new DepositEvent(depositEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.from = depositEvent.params.from.toHex()
  event.amount = depositEvent.params.amount
  event.timestamp = depositEvent.block.timestamp
  event.save()
}


export function handleUnstakeEvent(unstakeEvent: Unstake): void {
  let tenderizerAddress = unstakeEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)
  let amount = unstakeEvent.params.amount
  let config = Config.load(protocolId)
  let tenderToken = TenderToken.bind(Address.fromString(config.tenderToken))
  let timestamp = unstakeEvent.block.timestamp.toI32()

  // Update User data
  let userData = loadOrCreateUserDeployment(unstakeEvent.params.from.toHex(), protocolId)
  let totalUserRewards = tenderToken.balanceOf(unstakeEvent.params.from).plus(amount).minus(userData.tenderizerStake)
  if ( totalUserRewards < amount ){
    userData.claimedRewards = userData.claimedRewards.plus(totalUserRewards)
    userData.tenderizerStake = userData.tenderizerStake.minus(amount.minus(totalUserRewards))    
  } else {
    userData.claimedRewards = userData.claimedRewards.plus(amount)
  }
  userData.shares = tenderToken.sharesOf(unstakeEvent.params.from)
  userData.save()

  // Update User day data
  let userDay = loadOrCreateUserDeploymentDay(
    timestamp, 
    unstakeEvent.params.from.toHex(), 
    protocolId
  )
  userDay.shares = tenderToken.sharesOf(unstakeEvent.params.from)
  userDay.save()

  // Update day data
  let day = loadOrCreateTernderizerDay(timestamp, protocolId)
  day.unstakes = day.unstakes.plus(amount)
  day.save()

  // Update Tenderizer data
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.currentPrincipal = tenderizer.currentPrincipal.minus(amount)
  tenderizer.save()

  // Save raw event
  let event = new UnstakeEvent(unstakeEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.from = unstakeEvent.params.from.toHex()
  event.node = unstakeEvent.params.node.toHex()
  event.amount = unstakeEvent.params.amount
  event.unstakeLockID = unstakeEvent.params.unstakeLockID
  event.timestamp = unstakeEvent.block.timestamp
  event.save()
}

export function handleProcessUnstakesEvent(processUnstakesEvent: ProcessUnstakes): void {
  let tenderizerAddress = processUnstakesEvent.address.toHex()
  // Save raw event
  let event = new ProcessUnstakesEvent(processUnstakesEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.from = processUnstakesEvent.params.from.toHex()
  event.node = processUnstakesEvent.params.node.toHex()
  event.amount = processUnstakesEvent.params.amount
  event.timestamp = processUnstakesEvent.block.timestamp
  event.save()
}

export function handleWithdrawEvent(withdrawEvent: Withdraw): void {
  let tenderizerAddress = withdrawEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)
  let amount = withdrawEvent.params.amount
  let usdPrice = getUSDPrice(Config.load(protocolId).steak)
  let config = Config.load(protocolId)
  let tenderToken = TenderToken.bind(Address.fromString(config.tenderToken))

  // Update day data
  let day = loadOrCreateTernderizerDay(withdrawEvent.block.timestamp.toI32(), protocolId)
  day.withdrawals = day.withdrawals.plus(amount)
  day.save()

  // Update Tenderizer data
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.withdrawals = tenderizer.withdrawals.plus(amount)
  tenderizer.TVL = tenderizer.currentPrincipal.divDecimal(exponentToBigDecimal(BI_18)).times(usdPrice)
  tenderizer.save()

  // Save raw event
  let event = new WithdrawEvent(withdrawEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.from = withdrawEvent.params.from.toHex()
  event.amount = withdrawEvent.params.amount
  event.unstakeLockID = withdrawEvent.params.unstakeLockID
  event.timestamp = withdrawEvent.block.timestamp
  event.save()
}

export function handleRewardsClaimedEvent(rewardsClaimedEvent: RewardsClaimed): void {
  let tenderizerAddress = rewardsClaimedEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)
  let amount = rewardsClaimedEvent.params.stakeDiff
  let usdPrice = getUSDPrice(Config.load(protocolId).steak)

  // Update day data
  let day = loadOrCreateTernderizerDay(rewardsClaimedEvent.block.timestamp.toI32(), protocolId)
  day.rewards = day.rewards.plus(amount)
  day.save()
  
  // Update Tenderizer data
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.rewards = tenderizer.rewards.plus(amount)
  tenderizer.rewardsUSD = tenderizer.rewards.divDecimal(exponentToBigDecimal(BI_18)).times(usdPrice)
  tenderizer.currentPrincipal = rewardsClaimedEvent.params.currentPrincipal
  tenderizer.TVL = tenderizer.currentPrincipal.divDecimal(exponentToBigDecimal(BI_18)).times(usdPrice)
  tenderizer.save()

  // Save raw event
  let event = new RewardsClaimedEvent(rewardsClaimedEvent.transaction.hash.toHex());
  event.tenderizer = tenderizer.id
  event.tenderizerAddress = tenderizerAddress
  event.rewards = rewardsClaimedEvent.params.stakeDiff
  event.currentPrincipal = rewardsClaimedEvent.params.currentPrincipal
  event.oldPrincipal = rewardsClaimedEvent.params.oldPrincipal
  event.timestamp = rewardsClaimedEvent.block.timestamp
  event.save() 
}

export function handleProtocolFeeCollectedEvent(protocolFeeCollectedEvent: ProtocolFeeCollected): void {
  let tenderizerAddress = protocolFeeCollectedEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)
  let usdPrice = getUSDPrice(Config.load(protocolId).steak)

  // Update Tenderizer totals
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.protocolFees = tenderizer.protocolFees.plus(protocolFeeCollectedEvent.params.amount)
  tenderizer.protocolFeesUSD = tenderizer.protocolFees.divDecimal(exponentToBigDecimal(BI_18)).times(usdPrice)
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
  let usdPrice = getUSDPrice(Config.load(protocolId).steak)

  // Update Tenderizer totals
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.liquidityFees = tenderizer.liquidityFees.plus(liquidityFeeCollectedEvent.params.amount)
  tenderizer.liquidityFeesUSD = tenderizer.liquidityFees.divDecimal(exponentToBigDecimal(BI_18)).times(usdPrice)
  tenderizer.save()

  // Save raw event
  let event = new LiquidityFeeCollectedEvent(liquidityFeeCollectedEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.amount = liquidityFeeCollectedEvent.params.amount
  event.timestamp = liquidityFeeCollectedEvent.block.timestamp
  event.save()
}
