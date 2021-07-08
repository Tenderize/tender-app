import { TenderizeGlobal, ProtocolConfig, TenderizerCreatedEvent } from "../types/schema";
import { TenderizerCreated } from "../types/Registry/Registry"
import { 
  Tenderizer as TenderizerContract, 
  TenderFarm as TenderFarmContract,
  Pool as PoolContract 
} from "../types/templates"
import { loadOrCreateTenderizeGlobal, createPool } from "./utils"

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
  createPool(params.bpool, params.esp)
  PoolContract.create(params.bpool)
}

