import { FarmEvent, HarvestEvent, UnfarmEvent } from "../types/schema"
import { Farm } from "../types/templates/TenderFarm/TenderFarm"
import { 
    loadOrCreateTenderizer,
    getTenderizerIdByTenderFarmAddress,
   } from "./utils"

export function handleFarmEvent(farmEvent: Farm): void {
    let tenderFarmAddress = farmEvent.address.toHex()
    let tenderizerId  = getTenderizerIdByTenderFarmAddress(tenderFarmAddress)
  
    // Sanity check, tenderizers would generally always be registered
    if(tenderizerId ==  ''){
      // TODO: add log
      return
    }
  
    // Update Tenderizer deposit total
    let tenderizer = loadOrCreateTenderizer(tenderizerId)
    tenderizer.farmDeposits = tenderizer.farmDeposits.plus(farmEvent.params.amount)
    tenderizer.save()
  
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
  
    // Update Tenderizer deposit total
    let tenderizer = loadOrCreateTenderizer(tenderizerId)
    tenderizer.farmWithdrawals = tenderizer.farmWithdrawals.plus(unfarmEvent.params.amount)
    tenderizer.save()
  
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

  // Update Tenderizer deposit total
  let tenderizer = loadOrCreateTenderizer(tenderizerId)
  tenderizer.farmHarvest = tenderizer.farmHarvest.plus(harvestEvent.params.amount)
  tenderizer.save()

  // Save raw event
  let event = new HarvestEvent(harvestEvent.transaction.hash.toHex());
  event.tenderFarm = tenderFarmAddress
  event.from = harvestEvent.params.account.toHex()
  event.amount = harvestEvent.params.amount
  event.timestamp = harvestEvent.block.timestamp
  event.save()
}