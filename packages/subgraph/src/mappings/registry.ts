import { TenderizeGlobal, TenderizerConfig, TenderizerCreatedEvent } from "../types/schema";
import { TenderizerCreated } from "../types/Registry/Registry"
import { 
  Tenderizer as TenderizerContract, 
  TenderFarm as TenderFarmContract 
} from "../types/templates"
import { loadOrCreateTenderizeGlobal } from "./utils"

export function handleTenderizerCreated(config: TenderizerCreated): void {
  // Create Config entity and save raw event
  let params = config.params.config
  let tenderizerConfig = new TenderizerConfig(params.name) 
  let tenderizerConfigEvent = new TenderizerCreatedEvent(config.transaction.hash.toHex()) 
  
  tenderizerConfigEvent.name = params.name
  tenderizerConfigEvent.steak = tenderizerConfig.steak = params.steak.toHex()
  tenderizerConfigEvent.tenderizer = tenderizerConfig.tenderizer = params.tenderizer.toHex()
  tenderizerConfigEvent.tenderToken = tenderizerConfig.tenderToken = params.tenderToken.toHex()
  tenderizerConfigEvent.esp = tenderizerConfig.esp = params.esp.toHex()
  tenderizerConfigEvent.bpool = tenderizerConfig.bpool = params.bpool.toHex()
  tenderizerConfigEvent.tenderFarm = tenderizerConfig.tenderFarm = params.tenderFarm.toHex()
  tenderizerConfigEvent.timestamp = config.block.timestamp
  
  tenderizerConfig.save()
  tenderizerConfigEvent.save()

  // Add to Global config
  let tenderizeGlobal = loadOrCreateTenderizeGlobal()
  let configs = tenderizeGlobal.configs
  configs.push(tenderizerConfig.id)
  tenderizeGlobal.configs = configs
  tenderizeGlobal.save()

  // Create new sources
  TenderizerContract.create(params.tenderizer)
  TenderFarmContract.create(params.tenderFarm)
}

