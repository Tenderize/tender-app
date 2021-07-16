import { ProtocolConfig, TenderizerCreatedEvent } from "../types/schema";
import { TenderizerCreated } from "../types/Registry/Registry"
import { 
  Tenderizer as TenderizerContract, 
  TenderFarm as TenderFarmContract 
} from "../types/templates"
import { Tenderizer } from "../types/templates/Tenderizer/Tenderizer"
import {
  loadOrCreateTenderizeGlobal,
  loadOrCreateTenderizer,
  loadOrCreateTernderizerDay,
  ONE_BI 
} from "./utils"
import { Address } from "@graphprotocol/graph-ts";

export function handleTenderizerCreated(config: TenderizerCreated): void {
  // Create Config entity and save raw event
  let params = config.params.config
  let prtocolConfig = new ProtocolConfig(params.name) 
  let prtocolConfigEvent = new TenderizerCreatedEvent(config.transaction.hash.toHex()) 
  
  prtocolConfigEvent.name = params.name
  prtocolConfigEvent.steak = prtocolConfig.steak = params.steak.toHex()
  prtocolConfigEvent.tenderizer = prtocolConfig.tenderizer = params.tenderizer.toHex()
  prtocolConfigEvent.tenderToken = prtocolConfig.tenderToken = params.tenderToken.toHex()
  prtocolConfigEvent.esp = prtocolConfig.esp = params.esp.toHex()
  prtocolConfigEvent.bpool = prtocolConfig.bpool = params.bpool.toHex()
  prtocolConfigEvent.tenderFarm = prtocolConfig.tenderFarm = params.tenderFarm.toHex()
  prtocolConfigEvent.timestamp = config.block.timestamp
  
  prtocolConfig.save()
  prtocolConfigEvent.save()

  // Add to Global config
  let tenderizeGlobal = loadOrCreateTenderizeGlobal()
  let configs = tenderizeGlobal.configs
  configs.push(prtocolConfig.id)
  tenderizeGlobal.configs = configs
  tenderizeGlobal.save()

  // Create new sources
  TenderizerContract.create(params.tenderizer)
  TenderFarmContract.create(params.tenderFarm)

  // Accomodate initial deposit
  // The registry event is fired after bootstrap deposit 
  let tenderizerContract = Tenderizer.bind(Address.fromString(prtocolConfig.tenderizer))
  let amount = tenderizerContract.currentPrincipal().toBigDecimal()

  // Update day data
  let day = loadOrCreateTernderizerDay(config.block.timestamp.toI32(), params.name)
  day.deposits = day.deposits.plus(amount)
  day.volume = day.volume.plus(amount)
  day.cumulativeVolume = day.cumulativeVolume.plus(amount)
  day.save()

  // Update tenderizer data
  let tenderizer = loadOrCreateTenderizer(params.name)
  tenderizer.deposits = tenderizer.deposits.plus(amount)
  tenderizer.currentPrincipal = tenderizer.currentPrincipal.plus(amount)
  tenderizer.depositCount = tenderizer.depositCount.plus(ONE_BI)
  tenderizer.save()
}
