import { BigDecimal, BigInt, Address, dataSource } from "@graphprotocol/graph-ts";
import { Protocol, ProtocolConfig, TenderizeGlobal, User, TenderizerDay, Tenderizer, UserProtocol, TenderFarmDay, TenderFarm } from "../types/schema";
import { OneInch } from "../types/templates/Tenderizer/OneInch"
import * as config from "./config"
import { BPool } from "../types/templates/TenderFarm/BPool"
import { ElasticSupplyPool } from "../types/templates/TenderFarm/ElasticSupplyPool"

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString('0')
export let BI_18 = BigInt.fromI32(18)

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

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
    tenderizer.rewardsUSD = ZERO_BD
    tenderizer.rewardCount = ZERO_BI
    tenderizer.currentPrincipal = ZERO_BD
    tenderizer.TVL = ZERO_BD
    tenderizer.protocolFees = ZERO_BD
    tenderizer.protocolFeesUSD = ZERO_BD
    tenderizer.liquidityFees = ZERO_BD
    tenderizer.liquidityFeesUSD = ZERO_BD
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
    tenderFarm.harvestUSD = ZERO_BD
    tenderFarm.currentPrincipal = ZERO_BD
    tenderFarm.TVL = ZERO_BD
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

export function getUSDPrice(protocol: string): BigDecimal {
  if(dataSource.network() != 'mainnet'){
    return ZERO_BD
  }

  if(protocol == 'livepeer'){
    let daiLptBPool = OneInch.bind(Address.fromString(config.ONEINCH_ADDRESS))
    let res = daiLptBPool.getExpectedReturn(
      Address.fromString(config.DAI_ADDRESS),
      Address.fromString(config.LPT_ADDRESS),
      BigInt.fromI32(100),
      BigInt.fromI32(10),
      ZERO_BI
    )
    return res.value0.divDecimal(BigDecimal.fromString('100'))
  }
  return ZERO_BD
}

export function LPTokenToToken(amount: BigDecimal, protocol: string): BigDecimal {
  let config = ProtocolConfig.load(protocol)
  let bPool = BPool.bind(Address.fromString(config.bpool))
  let esp = ElasticSupplyPool.bind(Address.fromString(config.esp))
  let totalSupply = esp.totalSupply().toBigDecimal()
  let steakTokens = bPool.getBalance(Address.fromString(config.steak)).toBigDecimal()
  let tenderTokens = bPool.getBalance(Address.fromString(config.tenderToken)).toBigDecimal()
  return amount.div(totalSupply).times(steakTokens.plus(tenderTokens))
}