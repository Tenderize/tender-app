import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Protocol, ProtocolConfig, TenderizeGlobal, User, TenderizerDay, Tenderizer, UserTenderizer, UserProtocol, UserTenderFarm, TenderFarmDay, TenderFarm, Pool } from "../types/schema";
import { ConfigurableRightsPool } from '../types/templates/Pool/ConfigurableRightsPool';

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
    userProtocol.protocolName = protocolName
    userProtocol.protocol = id
    userProtocol.user = address

    // Save derived field
    let user = loadOrCreateUser(address)
    user.save()
    
    let protocol = loadOrCreateProtocol(protocolName)
    protocol.userCount = protocol.userCount.plus(ONE_BI)
    protocol.save()
  }
  return userProtocol as UserProtocol
}

export function loadOrCreateUserTenderizer(address: string, protocolName: string): UserTenderizer{
  let userProtocol = loadOrCreateUserProtocol(address, protocolName)

  let userTenderizer = UserTenderizer.load(address + '_' + protocolName)
  if (userTenderizer == null){
    userTenderizer = new UserTenderizer(address + '_' + protocolName)
    userTenderizer.userProtocol = userProtocol.id
    userTenderizer.deposits = ZERO_BD
    userTenderizer.withdrawals = ZERO_BD

    userProtocol.save()
  }
  return userTenderizer as UserTenderizer
}


export function loadOrCreateUserTenderFarm(address: string, protocolName: string): UserTenderFarm{
  let userProtocol = loadOrCreateUserProtocol(address, protocolName)

  let userTenderFarm = UserTenderFarm.load(address + '_' + protocolName)
  if (userTenderFarm == null){
    userTenderFarm = new UserTenderFarm(address + '_' + protocolName)
    userTenderFarm.userProtocol = userProtocol.id
    userTenderFarm.deposits = ZERO_BD
    userTenderFarm.withdrawals = ZERO_BD
    userTenderFarm.harvest = ZERO_BD

    userProtocol.save()
  }
  return userTenderFarm as UserTenderFarm
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

export function loadOrCreateTernderizerDay(timestamp: i32, protocol: string): TenderizerDay {
  let dayTimestamp = timestamp / 86400
  let dayID = dayTimestamp.toString() + '_' + protocol
  let dayStartTimestamp = dayTimestamp * 86400
  let day = TenderizerDay.load(dayID)

  if (day == null) {
    day = new TenderizerDay(dayID)
    let tenderizer = loadOrCreateTenderizer(protocol)
    day.date = dayStartTimestamp
    day.protocolName = protocol
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
    day.protocolName = protocol
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

export function createPool(bPoolAddress: Address, crpAdress: Address): void {
  let pool = new Pool(bPoolAddress.toHexString())
  // pool.crp = isCrp(crpAdress)
  pool.crp = true
  pool.rights = []
  // if (pool.crp) {
    // factory.crpCount += 1
    let crp = ConfigurableRightsPool.bind(crpAdress)
    pool.symbol = getCrpSymbol(crp)
    pool.name = getCrpName(crp)
    pool.crpController = Address.fromString(getCrpController(crp))
    pool.rights = getCrpRights(crp)
    pool.cap = getCrpCap(crp)

    // Listen for any future crpController changes.
    // CrpControllerContract.create(event.params.caller)
  // }
  // pool.controller = event.params.caller
  pool.publicSwap = false
  pool.finalized = false
  pool.active = true
  pool.swapFee = BigDecimal.fromString('0.000001')
  pool.totalWeight = ZERO_BD
  pool.totalShares = ZERO_BD
  pool.totalSwapVolume = ZERO_BD
  pool.totalSwapFee = ZERO_BD
  pool.liquidity = ZERO_BD
  // pool.createTime = event.block.timestamp.toI32()
  pool.tokensCount = BigInt.fromI32(0)
  pool.holdersCount = BigInt.fromI32(0)
  pool.joinsCount = BigInt.fromI32(0)
  pool.exitsCount = BigInt.fromI32(0)
  pool.swapsCount = BigInt.fromI32(0)
  // pool.factoryID = event.address.toHexString()
  pool.tokensList = []
  // pool.tx = event.transaction.hash
  pool.save()
}

// export function isCrp(address: Address): boolean {
//     let crpFactory = CRPFactory.bind(Address.fromString(CRP_FACTORY))
//     let isCrp = crpFactory.try_isCrp(address)
//     if (isCrp.reverted) return false
//     return isCrp.value
//   }
  
  export function getCrpUnderlyingPool(crp: ConfigurableRightsPool): string | null {
    let bPool = crp.try_bPool()
    if (bPool.reverted) return null;
    return bPool.value.toHexString()
  }
  
  export function getCrpController(crp: ConfigurableRightsPool): string | null {
    let controller = crp.try_getController()
    if (controller.reverted) return null;
    return controller.value.toHexString()
  }
  
  export function getCrpSymbol(crp: ConfigurableRightsPool): string {
    let symbol = crp.try_symbol()
    if (symbol.reverted) return ''
    return symbol.value
  }
  
  export function getCrpName(crp: ConfigurableRightsPool): string {
    let name = crp.try_name()
    if (name.reverted) return ''
    return name.value
  }
  
  export function getCrpCap(crp: ConfigurableRightsPool): BigInt {
    let cap = crp.try_getCap()
    if (cap.reverted) return BigInt.fromI32(0)
    return cap.value
  }
  
  export function getCrpRights(crp: ConfigurableRightsPool): string[] {
    let rights = crp.try_rights()
    if (rights.reverted) return []
    let rightsArr: string[] = []
    if (rights.value.value0) rightsArr.push('canPauseSwapping')
    if (rights.value.value1) rightsArr.push('canChangeSwapFee')
    if (rights.value.value2) rightsArr.push('canChangeWeights')
    if (rights.value.value3) rightsArr.push('canAddRemoveTokens')
    if (rights.value.value4) rightsArr.push('canWhitelistLPs')
    if (rights.value.value5) rightsArr.push('canChangeCap')
    return rightsArr
  }