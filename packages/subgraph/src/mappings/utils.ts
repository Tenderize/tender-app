import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Protocol, ProtocolConfig, TenderizeGlobal, User, TenderizerDay, Tenderizer, UserProtocol, TenderFarmDay, TenderFarm } from "../types/schema";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString('0')

export function loadOrCreateTenderizeGlobal(): TenderizeGlobal {
  let tenderizeGlobal = TenderizeGlobal.load('1')
  if (tenderizeGlobal == null){
    tenderizeGlobal = new TenderizeGlobal('1')
    tenderizeGlobal.configs = []
  }
  return tenderizeGlobal as TenderizeGlobal
}

export function loadOrCreateProtocol(id: string): Protocol {
  let protocol = Protocol.load(id)
  if(protocol == null){
    protocol = new Protocol(id)
    protocol.userCount = ZERO_BI
  }
  return protocol as Protocol
}

export function loadOrCreateTenderizer(id: string): Tenderizer {
  let tenderizer = Tenderizer.load(id)

  if(tenderizer == null){
    tenderizer = new Tenderizer(id)
    tenderizer.protocol = id
    tenderizer.deposits = ZERO_BD
    tenderizer.depositCount = ZERO_BI
    tenderizer.withdrawals = ZERO_BD
    tenderizer.withdrawalCount = ZERO_BI
    tenderizer.rewards = ZERO_BD
    tenderizer.rewardCount = ZERO_BI
    tenderizer.currentPrincipal = ZERO_BD
    tenderizer.protocolFees = ZERO_BD
    tenderizer.liquidityFees = ZERO_BD
  }

  return tenderizer as Tenderizer
}

export function loadOrCreateTenderFarm(id: string): TenderFarm {
  let tenderFarm = TenderFarm.load(id)

  if(tenderFarm == null){
    tenderFarm = new TenderFarm(id)
    tenderFarm.protocol = id
    tenderFarm.deposits = ZERO_BD
    tenderFarm.depositCount = ZERO_BI
    tenderFarm.withdrawals = ZERO_BD
    tenderFarm.withdrawalCount = ZERO_BI
    tenderFarm.harvest = ZERO_BD
    tenderFarm.harvestCount = ZERO_BI
    tenderFarm.currentPrincipal = ZERO_BD
  }

  return tenderFarm as TenderFarm
}

export function loadOrCreateUser(adress: string): User {
  let user = User.load(adress)
  if(user == null){
    user = new User(adress)
  }
  return user as User
}

export function loadOrCreateUserProtocol(address: string, protocolName: string): UserProtocol {
  let id = address + '_' + protocolName
  let userProtocol = UserProtocol.load(id)
  if(userProtocol == null){
    userProtocol = new UserProtocol(id)
    userProtocol.protocol = id
    userProtocol.user = address
    userProtocol.tenderizerDeposits = ZERO_BD
    userProtocol.tenderizerWithdrawals = ZERO_BD
    userProtocol.farmDeposits = ZERO_BD
    userProtocol.farmWithdrawals = ZERO_BD
    userProtocol.farmHarvest = ZERO_BD

    // Save derived field
    let user = loadOrCreateUser(address)
    user.save()
    
    let protocol = loadOrCreateProtocol(protocolName)
    protocol.userCount = protocol.userCount.plus(ONE_BI)
    protocol.save()
  }
  return userProtocol as UserProtocol
}

export function getProtocolIdByTenderizerAddress(address: string): string {
  // TODO: Is there a better way to do this?
  let globals = TenderizeGlobal.load('1')
  let globalConfigs = globals.configs
  for (let i = 0; i < globalConfigs.length; i++) { 
    let c = ProtocolConfig.load(globalConfigs[i]) as ProtocolConfig
    if(c.tenderizer == address){
      return c.id
    }
  }
  return ''
}

export function getProtocolIdByTenderFarmAddress(address: string): string {
  // TODO: Is there a better way to do this?
  let globals = TenderizeGlobal.load('1')
  let globalConfigs = globals.configs
  for (let i = 0; i < globalConfigs.length; i++) { 
    let c = ProtocolConfig.load(globalConfigs[i]) as ProtocolConfig
    if(c.tenderFarm == address){
      return c.id
    }
  }
  return ''
}

export function loadOrCreateTernderizerDay(timestamp: i32, protocol: string): TenderizerDay {
  let dayTimestamp = timestamp / 86400
  let dayID = dayTimestamp.toString() + '_' + protocol
  let dayStartTimestamp = dayTimestamp * 86400
  let day = TenderizerDay.load(dayID)

  if (day == null) {
    day = new TenderizerDay(dayID)
    let tenderizer = loadOrCreateTenderizer(protocol)
    day.date = dayStartTimestamp
    day.tenderizer = tenderizer.id
    day.deposits = ZERO_BD
    day.withdrawals = ZERO_BD
    day.volume = ZERO_BD
    day.cumulativeVolume = tenderizer.deposits.minus(tenderizer.withdrawals)
    day.rewards = ZERO_BD
    day.cumulativeRewards = tenderizer.rewards
  }
  return day as TenderizerDay;
}

export function loadOrCreateTenderFarmDay(timestamp: i32, protocol: string): TenderFarmDay {
  let dayTimestamp = timestamp / 86400
  let dayID = dayTimestamp.toString() + '_' + protocol
  let dayStartTimestamp = dayTimestamp * 86400
  let day = TenderFarmDay.load(dayID)

  if (day == null) {
    day = new TenderFarmDay(dayID)
    let tenderFarm = loadOrCreateTenderFarm(protocol)
    day.date = dayStartTimestamp
    day.tenderFarm = tenderFarm.id
    day.deposits = ZERO_BD
    day.withdrawals = ZERO_BD
    day.volume = ZERO_BD
    day.cumulativeVolume = tenderFarm.deposits.minus(tenderFarm.withdrawals)
    day.harvest = ZERO_BD
    day.cumulatinveHarvest = tenderFarm.harvest
  }
  return day as TenderFarmDay;
}