import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Protocol, ProtocolConfig, TenderizeGlobal, User, UserProtocolData, Day } from "../types/schema";

export let ZERO_BI = BigInt.fromI32(0);
export let ZERO_BD = BigDecimal.fromString('0')

export function loadOrCreateTenderizer(id: string): Protocol {
  let tenderizer = Protocol.load(id)

  if(tenderizer == null){
    tenderizer = new Protocol(id)
    
    tenderizer.tenderizerDeposits = ZERO_BD
    tenderizer.tenderizerWithdrawals = ZERO_BD
    tenderizer.rewards = ZERO_BD
    tenderizer.protocolFees = ZERO_BD
    tenderizer.liquidityFees = ZERO_BD
    tenderizer.farmDeposits = ZERO_BD
    tenderizer.farmWithdrawals = ZERO_BD
    tenderizer.farmHarvest = ZERO_BD
  }

  return tenderizer as Protocol
}

export function loadOrCreateTenderizeGlobal(): TenderizeGlobal {
  let tenderizeGlobal = TenderizeGlobal.load('1')
  if (tenderizeGlobal == null){
    tenderizeGlobal = new TenderizeGlobal('1')
    tenderizeGlobal.configs = []
  }
  return tenderizeGlobal as TenderizeGlobal
}

export function loadOrCreateUserTenderizerData(address: string, tenderizer: string): UserProtocolData{
  let user = loadOrCreateUser(address)
  let userTenderizerData = UserProtocolData.load(address + '_' + tenderizer)
  if (userTenderizerData == null){
    userTenderizerData = new UserProtocolData(address + '_' + tenderizer)
    userTenderizerData.protocol = tenderizer
    userTenderizerData.tenderizerDeposits = ZERO_BD
    userTenderizerData.tenderizerWithdrawals = ZERO_BD
    userTenderizerData.farmDeposits = ZERO_BD
    userTenderizerData.farmWithdrawals = ZERO_BD
    userTenderizerData.farmHarvest = ZERO_BD

    let userDataList = user.tenderizerData
    userDataList.push(userTenderizerData.id)
    user.tenderizerData = userDataList
    user.save()
  }
  return userTenderizerData as UserProtocolData
}

export function loadOrCreateUser(adress: string): User {
  let user = User.load(adress)
  if(user == null){
    user = new User(adress)
    user.tenderizerData = []
  }
  return user as User
}

export function getProtocolIdByTenderizerAddress(address: string): string {
  // TODO: Is there a better way to do this?
  let globals = TenderizeGlobal.load('1')
  let globalConfigs = globals.configs
  // TODO: use map/filter
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
  // TODO: use map/filter
  for (let i = 0; i < globalConfigs.length; i++) { 
    let c = ProtocolConfig.load(globalConfigs[i]) as ProtocolConfig
    if(c.tenderFarm == address){
      return c.id
    }
  }
  return ''
}

export function loadOrCreateDay(timestamp: i32, protocol: string): Day {
  let dayTimestamp = timestamp / 86400
  let dayID = dayTimestamp.toString() + '_' + protocol
  let dayStartTimestamp = dayTimestamp * 86400
  let day = Day.load(dayID)

  if (day == null) {
    day = new Day(dayID)
    let latestData = loadOrCreateTenderizer(protocol)
    day.date = dayStartTimestamp
    day.protocol = protocol
    day.tenderizerDepositVolume = ZERO_BD
    day.totalTenderizerDeposit = latestData.tenderizerDeposits.minus(latestData.tenderizerWithdrawals)
    day.rewardsVolume = ZERO_BD
    day.totalRewards = latestData.rewards
    day.farmVolume = ZERO_BD
    day.totalFarm = latestData.farmDeposits.minus(latestData.farmWithdrawals)
    day.farmtHarvestVolume = ZERO_BD
    day.totalFarmHarvest = latestData.farmHarvest
    day.save();
  }
  return day as Day;
}