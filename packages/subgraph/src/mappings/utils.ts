import { BigInt } from "@graphprotocol/graph-ts";
import { Tenderizer, TenderizerConfig, TenderizeGlobal, User, UserTenderizerData } from "../types/schema";

export let ZERO_BI = BigInt.fromI32(0);

export function loadOrCreateTenderizer(id: string): Tenderizer {
  let tenderizer = Tenderizer.load(id)

  if(tenderizer == null){
    tenderizer = new Tenderizer(id)
    
    tenderizer.deposits = ZERO_BI
    tenderizer.withdrawals = ZERO_BI
    tenderizer.rewards = ZERO_BI
    tenderizer.protocolFees = ZERO_BI
    tenderizer.liquidityFees = ZERO_BI
    tenderizer.farmDeposits = ZERO_BI
    tenderizer.farmWithdrawals = ZERO_BI
    tenderizer.farmHarvest = ZERO_BI
  }

  return tenderizer as Tenderizer
}

export function loadOrCreateTenderizeGlobal(): TenderizeGlobal {
  let tenderizeGlobal = TenderizeGlobal.load('1')
  if (tenderizeGlobal == null){
    tenderizeGlobal = new TenderizeGlobal('1')
    tenderizeGlobal.configs = []
  }
  return tenderizeGlobal as TenderizeGlobal
}

export function loadOrCreateUserTenderizerData(address: string, tenderizer: string): UserTenderizerData{
  let user = loadOrCreateUser(address)
  let userTenderizerData = UserTenderizerData.load(address + '_' + tenderizer)
  if (userTenderizerData == null){
    userTenderizerData = new UserTenderizerData(address + '_' + tenderizer)
    userTenderizerData.protocol = tenderizer
    userTenderizerData.deposits = ZERO_BI
    userTenderizerData.withdrawals = ZERO_BI
    userTenderizerData.farmDeposits = ZERO_BI
    userTenderizerData.farmWithdrawals = ZERO_BI
    userTenderizerData.farmHarvest = ZERO_BI

    let userDataList = user.tenderizerData
    userDataList.push(userTenderizerData.id)
    user.tenderizerData = userDataList
    user.save()
  }
  return userTenderizerData as UserTenderizerData
}

export function loadOrCreateUser(adress: string): User {
  let user = User.load(adress)
  if(user == null){
    user = new User(adress)
    user.tenderizerData = []
  }
  return user as User
}

export function getTenderizerIdByTenderizerAddress(address: string): string {
  // TODO: Is there a better way to do this?
  let globals = TenderizeGlobal.load('1')
  let globalConfigs = globals.configs
  // TODO: use map/filter
  for (let i = 0; i < globalConfigs.length; i++) { 
    let c = TenderizerConfig.load(globalConfigs[i]) as TenderizerConfig
    if(c.tenderizer == address){
      return c.id
    }
  }
  return ''
}

export function getTenderizerIdByTenderFarmAddress(address: string): string {
  // TODO: Is there a better way to do this?
  let globals = TenderizeGlobal.load('1')
  let globalConfigs = globals.configs
  // TODO: use map/filter
  for (let i = 0; i < globalConfigs.length; i++) { 
    let c = TenderizerConfig.load(globalConfigs[i]) as TenderizerConfig
    if(c.tenderFarm == address){
      return c.id
    }
  }
  return ''
}