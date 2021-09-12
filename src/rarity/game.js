const Promise = require('bluebird')
const Rarity = require('./Rarity')
const NumberUtils = require('../base/NumberUtils')
const RarityGold = require('./RarityGold')
const RarityCraftingMaterials = require('./RarityCraftingMaterials')
const { rarityEth } = require('./RarityEthereumManager')
const { loadAccounts } = require('./AccountsLoader')
const logger = require('../base/logger')

const rarity = new Rarity()
const gold = new RarityGold()
const craftI = new RarityCraftingMaterials()

async function adventure(account, hero, nonce = null) {
  logger.info(`${hero} adventure start (account ${account})`)
  try {
    const adventurers_log = await rarity.adventurers_log(hero)
    const { timestamp } = await rarityEth.pendingBlock()
    if (NumberUtils.lte(timestamp, adventurers_log)) {
      logger.info(`${hero} adventure canceled, need to wait to timestamp ${adventurers_log}, current timestamp is ${timestamp}`)
      return
    }
    await rarity.adventure(account, hero, nonce)
    const { _xp, _level } = await rarity.summoner(hero)
    const xp_required = await rarity.xp_required(_level)
    // logger.info({ adventurers_log, _xp, _level, xp_required })
    if (NumberUtils.gte(_xp, xp_required)) {
      await rarity.level_up(account, hero, nonce)
      logger.info(`${hero} adventure level up`)
    }
    logger.info(`${hero} adventure complete`)
  } catch (e) {
    logger.error(`${hero} adventure error`, e)
  }
}

async function claimGold(account, hero) {
  logger.info(`${hero} claimGold start (account ${account})`)
  try {
    const claimable = await gold.claimable(hero)
    if (!NumberUtils.gt(claimable, 0)) {
      logger.info(`${hero} claimGold canceled, no gold`)
      return
    }
    await gold.claim(account, hero)
    logger.info(`${hero} claimGold claimed ${claimable} gold`)
  } catch (e) {
    logger.error(`${hero} claimGold error`, e)
  }
}

async function collectCraftI(account, hero) {
  logger.info(`${hero} collectCraft(I) start (account ${account})`)
  try {
    const reward = await craftI.scout(hero)
    if (!NumberUtils.gt(reward, 0)) {
      logger.info(`${hero} collectCraft(I) canceled, reward is 0`)
      return
    }
    const { timestamp } = await rarityEth.pendingBlock()
    const adventurers_log = await craftI.adventurers_log(hero)
    if (NumberUtils.lte(timestamp, adventurers_log)) {
      logger.info(`${hero} collectCraft(I) canceled, need to wait to timestamp ${adventurers_log}, current timestamp is ${timestamp}`)
      return
    }
    await craftI.adventure(account, hero)
    const balance = await craftI.balanceOf(hero)
    logger.info(`${hero} collectCraft(I) complete, balance is ${balance} now`)
  } catch (e) {
    logger.error(`${hero} collectCraft(I) error`, e)
  }
}

async function adventureAll(AddressHeros) {
  logger.info('adventureAll start')
  for (const { address, heros } of AddressHeros) {
    for (const hero of heros) {
      await adventure(address, hero)
      await collectCraftI(address, hero)
    }
  }
  logger.info('adventureAll complete')
}

async function claimGoldAll(AddressHeros) {
  logger.info('claimGoldAll start')
  for (const { address, heros } of AddressHeros) {
    for (const hero of heros) {
      await claimGold(address, hero)
    }
  }
  logger.info('claimGoldAll complete')
}

async function scheduleAdventure() {
  const AddressHeros = await loadAccounts()
  const CronJob = require('cron').CronJob;
  // second minute hour dayOfMonth month dayOfWeek
  const cron = '0 0 * * * *' // try every 1 hour
  const job = new CronJob(cron, function () {
    adventureAll(AddressHeros)
  }, null, false, 'Asia/Shanghai')
  job.start()
  logger.info(`scheduled ${cron}`)
}

async function startAdventure() {
  const AddressHeros = await loadAccounts()
  return adventureAll(AddressHeros)
}

async function startClaimGold() {
  const AddressHeros = await loadAccounts()
  return claimGoldAll(AddressHeros)
}

module.exports = {
  scheduleAdventure,
  startAdventure,
  startClaimGold,
}
