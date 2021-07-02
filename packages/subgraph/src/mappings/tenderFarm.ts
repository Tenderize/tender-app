import { FarmEvent, HarvestEvent, UnfarmEvent } from "../types/schema"
import { Farm } from "../types/templates/TenderFarm/TenderFarm"
import { 
    loadOrCreateTenderizer,
    getTenderizerIdByTenderFarmAddress,
    loadOrCreateUserTenderizerData,
    loadOrCreateDay,
   } from "./utils"

export function handleFarmEvent(farmEvent: Farm): void {
    let tenderFarmAddress = farmEvent.address.toHex()
    let tenderizerId  = getTenderizerIdByTenderFarmAddress(tenderFarmAddress)
  
    // Sanity check, tenderizers would generally always be registered
    if(tenderizerId ==  ''){
      // TODO: add log
      return
    }

    // Update day data
    let day = loadOrCreateDay(farmEvent.block.timestamp.toI32(), tenderizerId)
    day.farmVolume = day.farmVolume.plus(farmEvent.params.amount.toBigDecimal())
    day.totalFarm = day.totalFarm.plus(farmEvent.params.amount.toBigDecimal())
    day.save()
  
    // Update Tenderizer deposit total
    let tenderizer = loadOrCreateTenderizer(tenderizerId)
    tenderizer.farmDeposits = tenderizer.farmDeposits.plus(farmEvent.params.amount)
    tenderizer.save()

    // Update User data
    let userData = loadOrCreateUserTenderizerData(farmEvent.params.account.toHex(), tenderizerId)
    userData.farmDeposits = userData.farmDeposits.plus(farmEvent.params.amount)
    userData.save()
  
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
    let tenderizerId  = getTenderizerIdByTenderFarmAddress(tenderFarmAddress)
  
    // Sanity check, tenderizers would generally always be registered
    if(tenderizerId ==  ''){
      // TODO: add log
      return
    }

    // Update day data
    let day = loadOrCreateDay(unfarmEvent.block.timestamp.toI32(), tenderizerId)
    day.farmVolume = day.farmVolume.minus(unfarmEvent.params.amount.toBigDecimal())
    day.totalFarm = day.totalFarm.minus(unfarmEvent.params.amount.toBigDecimal())
    day.save()
  
    // Update Tenderizer deposit total
    let tenderizer = loadOrCreateTenderizer(tenderizerId)
    tenderizer.farmWithdrawals = tenderizer.farmWithdrawals.plus(unfarmEvent.params.amount)
    tenderizer.save()

    // Update User data
    let userData = loadOrCreateUserTenderizerData(unfarmEvent.params.account.toHex(), tenderizerId)
    userData.farmWithdrawals = userData.farmWithdrawals.plus(unfarmEvent.params.amount)
    userData.save()
  
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
  let tenderizerId  = getTenderizerIdByTenderFarmAddress(tenderFarmAddress)

  // Sanity check, tenderizers would generally always be registered
  if(tenderizerId ==  ''){
    // TODO: add log
    return
  }

  // Update day data
  let day = loadOrCreateDay(harvestEvent.block.timestamp.toI32(), tenderizerId)
  day.farmtHarvestVolume = day.farmtHarvestVolume.plus(harvestEvent.params.amount.toBigDecimal())
  day.totalFarmHarvest = day.totalFarmHarvest.plus(harvestEvent.params.amount.toBigDecimal())
  day.save()

  // Update Tenderizer deposit total
  let tenderizer = loadOrCreateTenderizer(tenderizerId)
  tenderizer.farmHarvest = tenderizer.farmHarvest.plus(harvestEvent.params.amount)
  tenderizer.save()

  // Update User data
  let userData = loadOrCreateUserTenderizerData(harvestEvent.params.account.toHex(), tenderizerId)
  userData.farmHarvest = userData.farmHarvest.plus(harvestEvent.params.amount)
  userData.save()

  // Save raw event
  let event = new HarvestEvent(harvestEvent.transaction.hash.toHex());
  event.tenderFarm = tenderFarmAddress
  event.from = harvestEvent.params.account.toHex()
  event.amount = harvestEvent.params.amount
  event.timestamp = harvestEvent.block.timestamp
  event.save()
}