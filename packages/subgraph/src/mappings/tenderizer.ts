import { 
  Config,
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
  loadOrCreateUserDeployment,
  loadOrCreateTernderizerDay,
  ONE_BI,
  BI_18,
  exponentToBigDecimal,
  getUSDPrice,
  BD_100
 } from "./utils"
import { TenderToken } from "../types/templates/Tenderizer/TenderToken"
import { Address, BigInt, Value } from "@graphprotocol/graph-ts";

export function handleDepositEvent(depositEvent: Deposit): void {
  let tenderizerAddress = depositEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderizerAddress(tenderizerAddress)
  let amount = depositEvent.params.amount.toBigDecimal()
  let usdPrice = getUSDPrice(protocolId)
  let config = Config.load(protocolId)
  let tenderToken = TenderToken.bind(Address.fromString(config.tenderToken))

  // Update User data
  let userData = loadOrCreateUserDeployment(depositEvent.params.from.toHex(), protocolId)
  userData.tenderizerStake = userData.tenderizerStake.plus(amount)
  userData.shares = tenderToken.sharesOf(depositEvent.params.from).toBigDecimal()
  userData.save()

  // Update day data
  let day = loadOrCreateTernderizerDay(depositEvent.block.timestamp.toI32(), protocolId)
  day.deposits = day.deposits.plus(amount)
  day.save()

  // Update Tenderizer data
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.deposits = tenderizer.deposits.plus(amount)
  tenderizer.currentPrincipal = tenderizer.currentPrincipal.plus(amount)
  tenderizer.TVL = tenderizer.currentPrincipal.div(exponentToBigDecimal(BI_18)).times(usdPrice)
  // let tokens = Value.fromBigDecimal(tenderizer.deposits.minus(tenderizer.withdrawals)).toBigInt()
  // tenderizer.shares = tenderToken.tokensToShares(tokens).toBigDecimal()
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
  let usdPrice = getUSDPrice(protocolId)
  let config = Config.load(protocolId)
  let tenderToken = TenderToken.bind(Address.fromString(config.tenderToken))

  // Update User data
  let userData = loadOrCreateUserDeployment(withdrawEvent.params.from.toHex(), protocolId)
  userData.tenderizerStake = userData.tenderizerStake.minus(amount)
  userData.shares = tenderToken.sharesOf(withdrawEvent.params.from).toBigDecimal()
  userData.save()

  // Update day data
  let day = loadOrCreateTernderizerDay(withdrawEvent.block.timestamp.toI32(), protocolId)
  day.withdrawals = day.withdrawals.plus(amount)
  day.save()

  // Update Tenderizer data
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.withdrawals = tenderizer.withdrawals.plus(amount)
  tenderizer.currentPrincipal = tenderizer.currentPrincipal.minus(amount)
  tenderizer.TVL = tenderizer.currentPrincipal.div(exponentToBigDecimal(BI_18)).times(usdPrice)
  // let tokens = Value.fromBigDecimal(tenderizer.deposits.minus(tenderizer.withdrawals)).toBigInt()
  // tenderizer.shares = tenderToken.tokensToShares(tokens).toBigDecimal()
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
  let usdPrice = getUSDPrice(protocolId)

  // Update day data
  let day = loadOrCreateTernderizerDay(rewardsClaimedEvent.block.timestamp.toI32(), protocolId)
  day.rewards = day.rewards.plus(amount)
  day.APY = day.rewards.div(day.startPrinciple).times(BD_100)
  day.save()
  
  // Update Tenderizer data
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.rewards = tenderizer.rewards.plus(amount)
  tenderizer.rewardsUSD = tenderizer.rewards.div(exponentToBigDecimal(BI_18)).times(usdPrice)
  tenderizer.currentPrincipal = rewardsClaimedEvent.params.currentPrincipal.toBigDecimal()
  tenderizer.TVL = tenderizer.currentPrincipal.div(exponentToBigDecimal(BI_18)).times(usdPrice)
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
  let usdPrice = getUSDPrice(protocolId)

  // Update Tenderizer totals
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.protocolFees = tenderizer.protocolFees.plus(protocolFeeCollectedEvent.params.amount.toBigDecimal())
  tenderizer.protocolFeesUSD = tenderizer.protocolFees.div(exponentToBigDecimal(BI_18)).times(usdPrice)
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
  let usdPrice = getUSDPrice(protocolId)

  // Update Tenderizer totals
  let tenderizer = loadOrCreateTenderizer(protocolId)
  tenderizer.liquidityFees = tenderizer.liquidityFees.plus(liquidityFeeCollectedEvent.params.amount.toBigDecimal())
  tenderizer.liquidityFeesUSD = tenderizer.liquidityFees.div(exponentToBigDecimal(BI_18)).times(usdPrice)
  tenderizer.save()

  // Save raw event
  let event = new LiquidityFeeCollectedEvent(liquidityFeeCollectedEvent.transaction.hash.toHex());
  event.tenderizer = tenderizerAddress
  event.amount = liquidityFeeCollectedEvent.params.amount
  event.timestamp = liquidityFeeCollectedEvent.block.timestamp
  event.save()
}