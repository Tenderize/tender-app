import { 
  BigDecimal,
  BigInt,
  Address,
  dataSource,
  ethereum 
} from "@graphprotocol/graph-ts";
import { 
  Deployment,
  TenderizeGlobal,
  User,
  TenderSwap,
  TenderizerDay,
  Tenderizer,
  UserDeployment,
  UserDeploymentDay,
  TenderFarmDay,
  TenderFarm,
  Config,
  TendeSwapInfo,
  Token,
  DailyVolume,
  HourlyVolume,
  WeeklyVolume 
} from "../types/schema";
import { UniswapQuoter } from "../types/templates/Tenderizer/UniswapQuoter"
import * as config from "./config"
import { TenderSwap as TenderSwapContact} from "../types/templates/TenderSwap/TenderSwap"
import { LiquidityPoolToken } from "../types/templates/TenderFarm/LiquidityPoolToken"
import { TenderToken } from "../types/templates/TenderFarm/TenderToken"
import { ERC20 } from "../types/templates/TenderFarm/ERC20"
import { decimal } from "@protofire/subgraph-toolkit"

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
    tenderFarm.pendingRewardShares = ZERO_BI
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

export function loadOrCreateUserDeployment(address: string, protocolName: string): UserDeployment {
  let id = address + '_' + protocolName
  let userProtocol = UserDeployment.load(id)
  if(userProtocol == null){
    userProtocol = new UserDeployment(id)
    userProtocol.deployment = protocolName
    userProtocol.user = address
    userProtocol.tenderizerStake = ZERO_BI
    userProtocol.claimedRewards = ZERO_BI
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
    day.tenderizer = tenderizer.id
    day.date = dayStartTimestamp
    day.deposits = ZERO_BI
    day.unstakes = ZERO_BI
    day.withdrawals = ZERO_BI
    day.rewards = ZERO_BI
    day.startPrinciple = tenderizer.currentPrincipal
    day.DPY = ZERO_BD
    day.shares = ZERO_BI
    day.supply = ZERO_BI
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
    day.tenderfarm = tenderFarm.id
    day.date = dayStartTimestamp
    day.deposits = ZERO_BI
    day.withdrawals = ZERO_BI
    day.harvest = ZERO_BI
    day.rewards = ZERO_BI
    day.DPY = ZERO_BD
    day.startPrinciple = LPTokenToToken(tenderFarm.currentPrincipal.toBigDecimal(), protocol)
    day.save()
  }
  return day as TenderFarmDay;
}

export function loadOrCreateUserDeploymentDay(timestamp: i32, address: string, protocol: string): UserDeploymentDay {
  let dayTimestamp = timestamp / 86400
  let dayID = dayTimestamp.toString() + '_' + address + '_' + protocol
  let dayStartTimestamp = dayTimestamp * 86400
  let day = UserDeploymentDay.load(dayID)

  if (day == null) {
    day = new UserDeploymentDay(dayID)
    let user = loadOrCreateUserDeployment(address, protocol)
    day.userDeployment = user.id
    day.date = dayStartTimestamp
    // Initialize data with previous day data
    // Not needed for just a single value
    let dayList = user.dayData
    if(dayList.length == 0) {
      day.shares = ZERO_BI
    } else {
      let previousDayID = dayList.pop()
      let previousDay = UserDeploymentDay.load(previousDayID)
      day.shares = previousDay.shares
    }
    day.save()
  }
  return day as UserDeploymentDay;
}

export function getUSDPrice(steakToken: string): BigDecimal {
  let network = dataSource.network()
  if(network != 'mainnet' && network != 'arbitrum-one'){
    return ZERO_BD
  }

  let usdc: string
  if(network == 'mainnet'){
    usdc = config.USDC_ADDRESS
  } else if(network == 'arbitrum-one'){
    usdc = config.USDC_ADDRESS_ARBITURM
  }

  let TEN_18 = BigInt.fromI32(10).pow(18)
  let TEN_24 = BigInt.fromI32(10).pow(24) // 18 + 18 - 12

  let uniQuoter = UniswapQuoter.bind(Address.fromString(config.UNISWAP_QUOTER))
  let tokenToEth = uniQuoter.try_quoteExactInputSingle(
    Address.fromString(steakToken),
    uniQuoter.WETH9(),
    3000,
    TEN_18,
    BigInt.fromString('0')
  )
  if(tokenToEth.reverted) return ZERO_BD

  let ethToUSDC = uniQuoter.try_quoteExactInputSingle(
    uniQuoter.WETH9(),
    Address.fromString(usdc),
    3000,
    TEN_18,
    BigInt.fromString('0')
  )
  if(ethToUSDC.reverted) return ZERO_BD

  return tokenToEth.value.times(ethToUSDC.value).divDecimal(TEN_24.toBigDecimal())
}

export function LPTokenToToken(amount: BigDecimal, protocol: string): BigDecimal {
  let config = Config.load(protocol)
  let tenderSwap = TenderSwapContact.bind(Address.fromString(config.tenderSwap))
  let lpToken = LiquidityPoolToken.bind(tenderSwap.lpToken())
  let totalSupply = lpToken.totalSupply().toBigDecimal()
  let tenderTokens = tenderSwap.getToken0Balance().toBigDecimal()
  let steakTokens = tenderSwap.getToken1Balance().toBigDecimal()
  return amount.div(totalSupply).times(steakTokens.plus(tenderTokens))
}

export function tokensToShares(amount: BigInt, protocol: string): BigInt {
  let config = Config.load(protocol)
  let tenderToken = TenderToken.bind(Address.fromString(config.tenderToken))
  return tenderToken.tokensToShares(amount)
}

export function addressIsContract(config: Config, address: Address): Boolean {
  let addressString = address.toHex()
  return (
  addressString.includes(config.tenderToken) ||
  addressString.includes(config.lpToken) ||
  addressString.includes(config.tenderSwap) ||
  addressString.includes(config.tenderFarm) ||
  addressString.includes(config.tenderizer)
  ) as Boolean
}

// Tenderswap helpers
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

class SwapInfo {
  tokens: Address[]
  balances: BigInt[]
  A: BigInt
  swapFee: BigInt
  adminFee: BigInt
  withdrawFee: BigInt
  virtualPrice: BigInt
  owner: Address
  lpToken: Address
}

export function getOrCreateMetaSwap(
  address: Address,
  block: ethereum.Block,
  tx: ethereum.Transaction,
): TenderSwap {
  let swap = TenderSwap.load(address.toHexString())

  if (swap == null) {
    let info = getMetaSwapInfo(address)

    swap = new TenderSwap(address.toHexString())
    swap.address = address
    swap.numTokens = info.tokens.length
    swap.tokens = registerTokens(info.tokens, block, tx)
    swap.balances = info.balances
    swap.lpToken = info.lpToken

    swap.A = info.A

    swap.swapFee = info.swapFee
    swap.adminFee = info.adminFee
    swap.withdrawFee = info.withdrawFee

    swap.virtualPrice = info.virtualPrice

    swap.owner = info.owner

    swap.save()

    let system = getSystemInfo(block, tx)
    system.swapCount = system.swapCount.plus(BigInt.fromI32(1))
    system.save()
  }

  return swap as TenderSwap
}

export function getMetaSwapInfo(swap: Address): SwapInfo {
  let swapContract = TenderSwapContact.bind(swap)

  let tokens: Address[] = []
  let balances: BigInt[] = []

  tokens.push(swapContract.try_getToken0().value)
  tokens.push(swapContract.try_getToken1().value)
  balances.push(swapContract.try_getToken0Balance().value)
  balances.push(swapContract.try_getToken1Balance().value)

  return {
    tokens,
    balances,
    A: swapContract.getA(),
    swapFee: swapContract.feeParams().value0,
    adminFee: swapContract.feeParams().value1,
    withdrawFee: BigInt.fromI32(0),
    virtualPrice: swapContract.getVirtualPrice(),
    owner: swapContract.owner(),
    lpToken: swapContract.lpToken(),
  }
}

export function getSystemInfo(
  block: ethereum.Block,
  tx: ethereum.Transaction,
): TendeSwapInfo {
  let state = TendeSwapInfo.load("current")

  if (state == null) {
    state = new TendeSwapInfo("current")

    state.exchangeCount = BigInt.fromI32(0)
    state.swapCount = BigInt.fromI32(0)
    state.tokenCount = BigInt.fromI32(0)
  }

  state.updated = block.timestamp
  state.updatedAtBlock = block.number
  state.updatedAtTransaction = tx.hash

  return state as TendeSwapInfo
}

export function getOrCreateToken(
  address: Address,
  block: ethereum.Block,
  tx: ethereum.Transaction,
): Token {
  let token = Token.load(address.toHexString())

  if (token == null) {
    let erc20 = ERC20.bind(address)

    let name = erc20.try_name()
    let symbol = erc20.try_symbol()
    let decimals = erc20.try_decimals()

    token = new Token(address.toHexString())
    token.address = address
    token.name = name.reverted ? null : name.value.toString()
    token.symbol = symbol.reverted ? null : symbol.value.toString()
    token.decimals = BigInt.fromI32(decimals.reverted ? 18 : decimals.value)
    token.save()

    let system = getSystemInfo(block, tx)
    system.tokenCount = system.tokenCount.plus(BigInt.fromI32(1))
    system.save()
  }

  return token as Token
}

function registerTokens(
  list: Address[],
  block: ethereum.Block,
  tx: ethereum.Transaction,
): string[] {
  let result: string[] = []

  for (let i = 0; i < list.length; ++i) {
    let current = list[i]

    if (current.toHexString() != ZERO_ADDRESS) {
      let token = getOrCreateToken(current, block, tx)

      result.push(token.id)
    }
  }

  return result
}

export function getBalancesMetaSwap(swap: Address, N_COINS: number): BigInt[] {
  let swapContract = TenderSwapContact.bind(swap)
  let balances = new Array<BigInt>(<i32>N_COINS)
  balances[0] = swapContract.getToken0Balance()
  balances[1] = swapContract.getToken1Balance()
  return balances
}

export function getHourlyTradeVolume(
  swap: TenderSwap,
  timestamp: BigInt,
): HourlyVolume {
  let interval = BigInt.fromI32(60 * 60)
  let hour = timestamp.div(interval).times(interval)
  let id = swap.id + "-hour-" + hour.toString()

  let volume = HourlyVolume.load(id)

  if (volume == null) {
    volume = new HourlyVolume(id)
    volume.swap = swap.id
    volume.timestamp = hour
    volume.volume = decimal.ZERO
  }

  return volume!
}

export function getDailyTradeVolume(
  swap: TenderSwap,
  timestamp: BigInt,
): DailyVolume {
  let interval = BigInt.fromI32(60 * 60 * 24)
  let day = timestamp.div(interval).times(interval)
  let id = swap.id + "-day-" + day.toString()

  let volume = DailyVolume.load(id)

  if (volume == null) {
    volume = new DailyVolume(id)
    volume.swap = swap.id
    volume.timestamp = day
    volume.volume = decimal.ZERO
  }

  return volume!
}

export function getWeeklyTradeVolume(
  swap: TenderSwap,
  timestamp: BigInt,
): WeeklyVolume {
  let interval = BigInt.fromI32(60 * 60 * 24 * 7)
  let week = timestamp.div(interval).times(interval)
  let id = swap.id + "-week-" + week.toString()

  let volume = WeeklyVolume.load(id)

  if (volume == null) {
    volume = new WeeklyVolume(id)
    volume.swap = swap.id
    volume.timestamp = week
    volume.volume = decimal.ZERO
  }

  return volume!
}