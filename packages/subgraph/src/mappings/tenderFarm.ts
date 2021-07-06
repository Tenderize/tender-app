import { FarmEvent, HarvestEvent, UnfarmEvent } from "../types/schema"
import { Farm } from "../types/templates/TenderFarm/TenderFarm"
import {
    getProtocolIdByTenderFarmAddress,
    loadOrCreateTenderFarmDay,
    loadOrCreateTenderFarm,
    loadOrCreateUserTenderFarm,
    ONE_BI,
   } from "./utils"

export function handleFarmEvent(farmEvent: Farm): void {
    let tenderFarmAddress = farmEvent.address.toHex()
    let protocolId  = getProtocolIdByTenderFarmAddress(tenderFarmAddress)
    let amount = farmEvent.params.amount.toBigDecimal()

    // Sanity check, tenderizers would generally always be registered
    if(protocolId ==  ''){
      // TODO: add log
      return
    }
    
    // Update User data
    let userData = loadOrCreateUserTenderFarm(farmEvent.params.account.toHex(), protocolId)
    userData.deposits = userData.deposits.plus(amount)
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
    tenderFarm.save()

    // Save raw event
    let event = new FarmEvent(farmEvent.transaction.hash.toHex());
    event.tenderFarm = tenderFarmAddress
    event.from = farmEvent.params.account.toHex()
    event.amount = farmEvent.params.amount
    event.timestamp = farmEvent.block.timestamp
    event.save()
}

export function handleUnfarmEvent(unfarmEvent: Farm): void {
    let tenderFarmAddress = unfarmEvent.address.toHex()
    let protocolId  = getProtocolIdByTenderFarmAddress(tenderFarmAddress)
    let amount = unfarmEvent.params.amount.toBigDecimal()

    // Sanity check, tenderizers would generally always be registered
    if(protocolId ==  ''){
      // TODO: add log
      return
    }

    // Update User data
    let userData = loadOrCreateUserTenderFarm(unfarmEvent.params.account.toHex(), protocolId)
    userData.withdrawals = userData.withdrawals.plus(amount)
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
    tenderFarm.save()

    // Save raw event
    let event = new UnfarmEvent(unfarmEvent.transaction.hash.toHex());
    event.tenderFarm = tenderFarmAddress
    event.from = unfarmEvent.params.account.toHex()
    event.amount = unfarmEvent.params.amount
    event.timestamp = unfarmEvent.block.timestamp
    event.save()
}

export function handleHarvestEvent(harvestEvent: Farm): void {
  let tenderFarmAddress = harvestEvent.address.toHex()
  let protocolId  = getProtocolIdByTenderFarmAddress(tenderFarmAddress)
  let amount = harvestEvent.params.amount.toBigDecimal()

  // Sanity check, tenderizers would generally always be registered
  if(protocolId ==  ''){
    // TODO: add log
    return
  }
  
  // Update User data
  let userData = loadOrCreateUserTenderFarm(harvestEvent.params.account.toHex(), protocolId)
  userData.harvest = userData.harvest.plus(amount)
  userData.save()

  // Update day data
  let day = loadOrCreateTenderFarmDay(harvestEvent.block.timestamp.toI32(), protocolId)
  day.harvest = day.harvest.plus(amount)
  day.cumulatinveHarvest = day.cumulatinveHarvest.plus(amount)
  day.save()

  // Update Tenderizer deposit total
  let tenderFarm = loadOrCreateTenderFarm(protocolId)
  tenderFarm.harvest = tenderFarm.harvest.plus(amount)
  tenderFarm.harvestCount = tenderFarm.harvestCount.plus(ONE_BI)
  tenderFarm.save()

  // Save raw event
  let event = new HarvestEvent(harvestEvent.transaction.hash.toHex());
  event.tenderFarm = tenderFarmAddress
  event.from = harvestEvent.params.account.toHex()
  event.amount = harvestEvent.params.amount
  event.timestamp = harvestEvent.block.timestamp
  event.save()
}