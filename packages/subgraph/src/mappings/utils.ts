import { BigDecimal, BigInt, Address, dataSource } from "@graphprotocol/graph-ts";
import { Deployment, TenderizeGlobal, User, TenderizerDay, Tenderizer, UserDeployment, TenderFarmDay, TenderFarm, Config } from "../types/schema";
import { OneInch } from "../types/templates/Tenderizer/OneInch"
import * as config from "./config"
import { BPool } from "../types/templates/TenderFarm/BPool"
import { ElasticSupplyPool } from "../types/templates/TenderFarm/ElasticSupplyPool"

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString('0')
export let BI_18 = BigInt.fromI32(18)
export let BD_100 = BigDecimal.fromString('100')

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

export function loadOrCreateDeployment(id: string): Deployment {
  let protocol = Deployment.load(id)
  if(protocol == null){
    protocol = new Deployment(id)
    protocol.tenderizer = id
    protocol.tenderFarm = id
  }
  return protocol as Deployment
}

export function loadOrCreateTenderizer(id: string): Tenderizer {
  let tenderizer = Tenderizer.load(id)

  if(tenderizer == null){
    tenderizer = new Tenderizer(id)
    tenderizer.deposits = ZERO_BI
    tenderizer.withdrawals = ZERO_BI
    tenderizer.rewards = ZERO_BI
    tenderizer.rewardsUSD = ZERO_BD
    tenderizer.currentPrincipal = ZERO_BI
    tenderizer.TVL = ZERO_BD
    tenderizer.protocolFees = ZERO_BI
    tenderizer.protocolFeesUSD = ZERO_BD
    tenderizer.liquidityFees = ZERO_BI
    tenderizer.liquidityFeesUSD = ZERO_BD
    tenderizer.shares = ZERO_BI
    tenderizer.dayData = []
  }

  return tenderizer as Tenderizer
}

export function loadOrCreateTenderFarm(id: string): TenderFarm {
  let tenderFarm = TenderFarm.load(id)

  if(tenderFarm == null){
    tenderFarm = new TenderFarm(id)
    tenderFarm.deposits = ZERO_BI
    tenderFarm.withdrawals = ZERO_BI
    tenderFarm.harvest = ZERO_BI
    tenderFarm.harvestUSD = ZERO_BD
    tenderFarm.currentPrincipal = ZERO_BI
    tenderFarm.rewards = ZERO_BI
    tenderFarm.TVL = ZERO_BD
    tenderFarm.dayData = []
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

export function loadOrCreateUserDeployment(address: string, protocolName: string): UserDeployment {
  let id = address + '_' + protocolName
  let userProtocol = UserDeployment.load(id)
  if(userProtocol == null){
    userProtocol = new UserDeployment(id)
    userProtocol.deployment = protocolName
    userProtocol.user = address
    userProtocol.tenderizerStake = ZERO_BI
    userProtocol.farmAmount = ZERO_BI
    userProtocol.farmHarvest = ZERO_BI
    userProtocol.shares = ZERO_BI
   
    // Save derived fields
    let user = loadOrCreateUser(address)
    user.save()
    let protocol = loadOrCreateDeployment(protocolName)
    protocol.save()
  }
  return userProtocol as UserDeployment
}

export function getProtocolIdByTenderizerAddress(address: string): string {
  // TODO: Is there a better way to do this?
  let globals = TenderizeGlobal.load('1')
  let globalConfigs = globals.configs
  for (let i = 0; i < globalConfigs.length; i++) { 
    let c = Config.load(globalConfigs[i]) as Config
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
    let c = Config.load(globalConfigs[i]) as Config
    if(c.tenderFarm == address){
      return c.id
    }
  }
  return ''
}

export function getProtocolIdByTenderTokenAddress(address: string): string {
  // TODO: Is there a better way to do this?
  let globals = TenderizeGlobal.load('1')
  let globalConfigs = globals.configs
  for (let i = 0; i < globalConfigs.length; i++) { 
    let c = Config.load(globalConfigs[i]) as Config
    if(c.tenderToken == address){
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
    day.deposits = ZERO_BI
    day.withdrawals = ZERO_BI
    day.rewards = ZERO_BI
    day.startPrinciple = tenderizer.currentPrincipal
    day.APY = ZERO_BD

    let dayList = tenderizer.dayData
    dayList.push(day.id)
    tenderizer.dayData = dayList
    tenderizer.save()
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
    day.deposits = ZERO_BI
    day.withdrawals = ZERO_BI
    day.harvest = ZERO_BI
    day.rewards = ZERO_BI
    day.APY = ZERO_BD
    day.startPrinciple = LPTokenToToken(tenderFarm.currentPrincipal.toBigDecimal(), protocol)
    day.save()

    let dayList = tenderFarm.dayData
    dayList.push(day.id)
    tenderFarm.dayData = dayList
    tenderFarm.save()
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
  let config = Config.load(protocol)
  let bPool = BPool.bind(Address.fromString(config.bpool))
  let esp = ElasticSupplyPool.bind(Address.fromString(config.esp))
  let totalSupply = esp.totalSupply().toBigDecimal()
  let steakTokens = bPool.getBalance(Address.fromString(config.steak)).toBigDecimal()
  let tenderTokens = bPool.getBalance(Address.fromString(config.tenderToken)).toBigDecimal()
  return amount.div(totalSupply).times(steakTokens.plus(tenderTokens))
}