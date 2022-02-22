import { Config, TenderizerCreatedEvent } from "../types/schema";
import { TenderizerCreated } from "../types/Registry/Registry"
import { 
  Tenderizer as TenderizerContract, 
  TenderFarm as TenderFarmContract,
  TenderToken as TenderTokenContract,
  TenderSwap as TenderSwapContract
} from "../types/templates"
import { Tenderizer } from "../types/templates/Tenderizer/Tenderizer"
import {
  loadOrCreateTenderizeGlobal,
  loadOrCreateTenderizer,
  loadOrCreateTernderizerDay,
  ONE_BI 
} from "./utils"
import { Address } from "@graphprotocol/graph-ts";
import { TenderToken } from "../types/templates/TenderToken/TenderToken"
import { TenderSwap } from "../types/templates/TenderSwap/TenderSwap"

export function handleTenderizerCreated(config: TenderizerCreated): void {
  // Create Config entity and save raw event
  let params = config.params.config
  let protocolConfig = new Config(params.name)
  let protocolConfigEvent = new TenderizerCreatedEvent(config.transaction.hash.toHex())
  
  protocolConfigEvent.name = params.name
  protocolConfigEvent.steak = protocolConfig.steak = params.steak.toHex()
  protocolConfigEvent.tenderizer = protocolConfig.tenderizer = params.tenderizer.toHex()
  protocolConfigEvent.tenderToken = protocolConfig.tenderToken = params.tenderToken.toHex()
  protocolConfigEvent.tenderFarm = protocolConfig.tenderFarm = params.tenderFarm.toHex()
  protocolConfigEvent.tenderSwap = protocolConfig.tenderSwap = params.tenderSwap.toHex()
  let tenderSwap = TenderSwap.bind(Address.fromString(protocolConfig.tenderSwap))
  protocolConfig.lpToken = tenderSwap.lpToken().toHex()
  protocolConfigEvent.timestamp = config.block.timestamp
  
  protocolConfig.save()
  protocolConfigEvent.save()

  // Add to Global config
  let tenderizeGlobal = loadOrCreateTenderizeGlobal()
  let configs = tenderizeGlobal.configs
  configs.push(protocolConfig.id)
  tenderizeGlobal.configs = configs
  tenderizeGlobal.save()

  // Create new sources
  TenderizerContract.create(params.tenderizer)
  TenderFarmContract.create(params.tenderFarm)
  TenderTokenContract.create(params.tenderToken)
  TenderSwapContract.create(params.tenderSwap)

  // Accomodate initial deposit
  // The registry event is fired after bootstrap deposit 
  let tenderizerContract = Tenderizer.bind(Address.fromString(params.tenderizer.toHex()))
  let amount = tenderizerContract.currentPrincipal()

  // Update tenderizer data
  let tenderizer = loadOrCreateTenderizer(params.name)
  tenderizer.deposits = tenderizer.deposits.plus(amount)
  tenderizer.currentPrincipal = tenderizer.currentPrincipal.plus(amount)
  tenderizer.save()
  
  // Update day data
  let day = loadOrCreateTernderizerDay(config.block.timestamp.toI32(), params.name)
  day.deposits = day.deposits.plus(amount)
  let tenderToken = TenderToken.bind(params.tenderToken)
  day.shares = tenderToken.getTotalShares()
  day.supply = tenderToken.getTotalPooledTokens()
  day.save()

}
