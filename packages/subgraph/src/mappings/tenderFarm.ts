import { FarmEvent, HarvestEvent, RewardsAddedEvent, UnfarmEvent } from "../types/schema"
import { Farm, Harvest, RewardsAdded, Unfarm } from "../types/templates/TenderFarm/TenderFarm"
import {
    getProtocolIdByTenderFarmAddress,
    loadOrCreateTenderFarmDay,
    loadOrCreateTenderFarm,
    loadOrCreateUserProtocol,
    ONE_BI,
    getUSDPrice,
    BI_18,
    exponentToBigDecimal,
    LPTokenToToken,
    BD_100,
    ZERO_BD,
   } from "./utils"

export function handleFarmEvent(farmEvent: Farm): void {
    let tenderFarmAddress = farmEvent.address.toHex()
    let protocolId  = getProtocolIdByTenderFarmAddress(tenderFarmAddress)
    let amount = farmEvent.params.amount.toBigDecimal()
    let usdPrice = getUSDPrice(protocolId)
   
    // Update User data
    let userData = loadOrCreateUserProtocol(farmEvent.params.account.toHex(), protocolId)
    userData.farmDeposits = userData.farmDeposits.plus(amount)
    userData.save()

    // Update day data
    let day = loadOrCreateTenderFarmDay(farmEvent.block.timestamp.toI32(), protocolId)
    day.deposits = day.deposits.plus(amount)
    day.volume = day.volume.plus(amount)
    day.cumulativeVolume = day.cumulativeVolume.plus(amount)
    day.save()
  
    // Update Tenderfarm data
    let tenderFarm = loadOrCreateTenderFarm(protocolId)
    tenderFarm.deposits = tenderFarm.deposits.plus(amount)
    tenderFarm.depositCount = tenderFarm.depositCount.plus(ONE_BI)
    tenderFarm.currentPrincipal = tenderFarm.currentPrincipal.plus(amount)
    let tokens = LPTokenToToken(tenderFarm.currentPrincipal, protocolId)
    tenderFarm.TVL = tokens.div(exponentToBigDecimal(BI_18)).times(usdPrice)
    tenderFarm.save()

    // Save raw event
    let event = new FarmEvent(farmEvent.transaction.hash.toHex());
    event.tenderFarm = tenderFarmAddress
    event.from = farmEvent.params.account.toHex()
    event.amount = farmEvent.params.amount
    event.timestamp = farmEvent.block.timestamp
    event.save()
}

export function handleUnfarmEvent(unfarmEvent: Unfarm): void {
    let tenderFarmAddress = unfarmEvent.address.toHex()
    let protocolId  = getProtocolIdByTenderFarmAddress(tenderFarmAddress)
    let amount = unfarmEvent.params.amount.toBigDecimal()
    let usdPrice = getUSDPrice(protocolId)

    // Update User data
    let userData = loadOrCreateUserProtocol(unfarmEvent.params.account.toHex(), protocolId)
    userData.farmWithdrawals = userData.farmWithdrawals.plus(amount)
    userData.save()

    // Update day data
    let day = loadOrCreateTenderFarmDay(unfarmEvent.block.timestamp.toI32(), protocolId)
    day.withdrawals = day.withdrawals.plus(amount)
    day.volume = day.volume.minus(amount)
    day.cumulativeVolume = day.cumulativeVolume.minus(amount)
    day.save()
  
    // Update TenderFarm data
    let tenderFarm = loadOrCreateTenderFarm(protocolId)
    tenderFarm.withdrawals = tenderFarm.withdrawals.plus(amount)
    tenderFarm.withdrawalCount = tenderFarm.withdrawalCount.plus(ONE_BI)
    tenderFarm.currentPrincipal = tenderFarm.currentPrincipal.minus(amount)
    let tokens = LPTokenToToken(tenderFarm.currentPrincipal, protocolId)
    tenderFarm.TVL = tokens.div(exponentToBigDecimal(BI_18)).times(usdPrice)
    tenderFarm.save()

    // Save raw event
    let event = new UnfarmEvent(unfarmEvent.transaction.hash.toHex());
    event.tenderFarm = tenderFarmAddress
    event.from = unfarmEvent.params.account.toHex()
    event.amount = unfarmEvent.params.amount
    event.timestamp = unfarmEvent.block.timestamp
    event.save()
}

export function handleHarvestEvent(harvestEvent: Harvest): void {
  let tenderFarmAddress = harvestEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderFarmAddress(tenderFarmAddress)
  let amount = harvestEvent.params.amount.toBigDecimal()
  let usdPrice = getUSDPrice(protocolId)
  
  // Update User data
  let userData = loadOrCreateUserProtocol(harvestEvent.params.account.toHex(), protocolId)
  userData.farmHarvest = userData.farmHarvest.plus(amount)
  userData.save()

  // Update day data
  let day = loadOrCreateTenderFarmDay(harvestEvent.block.timestamp.toI32(), protocolId)
  day.harvest = day.harvest.plus(amount)
  day.cumulatinveHarvest = day.cumulatinveHarvest.plus(amount)
  day.save()

  // Update TenderFarm totals
  let tenderFarm = loadOrCreateTenderFarm(protocolId)
  tenderFarm.harvest = tenderFarm.harvest.plus(amount)
  tenderFarm.harvestCount = tenderFarm.harvestCount.plus(ONE_BI)
  tenderFarm.harvestUSD = tenderFarm.harvest.div(exponentToBigDecimal(BI_18)).times(usdPrice)
  tenderFarm.save()

  // Save raw event
  let event = new HarvestEvent(harvestEvent.transaction.hash.toHex());
  event.tenderFarm = tenderFarmAddress
  event.from = harvestEvent.params.account.toHex()
  event.amount = harvestEvent.params.amount
  event.timestamp = harvestEvent.block.timestamp
  event.save()
}

export function handleRewardsAddedEvent(rewardsAddedEvent: RewardsAdded): void {
  let tenderFarmAddress = rewardsAddedEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderFarmAddress(tenderFarmAddress)
  let amount = rewardsAddedEvent.params.amount.toBigDecimal()

  // Sanity check, tenderizers would generally always be registered
  if(protocolId ==  ''){
    // TODO: add log
    return
  }

  // Update day data
  let day = loadOrCreateTenderFarmDay(rewardsAddedEvent.block.timestamp.toI32(), protocolId)
  day.rewards = day.rewards.plus(amount)
  day.cumulativeRewards = day.cumulativeRewards.plus(amount)
  if(day.startPrinciple.gt(ZERO_BD)){
    day.APY = day.rewards.div(day.startPrinciple).times(BD_100)
  }
  day.save()

  // Update TenderFarm totals
  let tenderFarm = loadOrCreateTenderFarm(protocolId)
  tenderFarm.rewards = tenderFarm.rewards.plus(amount)
  tenderFarm.rewardCount = tenderFarm.rewardCount.plus(ONE_BI)
  tenderFarm.save()

  // Save raw event
  let event = new RewardsAddedEvent(rewardsAddedEvent.transaction.hash.toHex());
  event.tenderFarm = tenderFarmAddress
  event.amount = rewardsAddedEvent.params.amount
  event.timestamp = rewardsAddedEvent.block.timestamp
  event.save()
}