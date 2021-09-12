const Promise = require('bluebird')
const Rarity = require('./Rarity')
const NumberUtils = require('../base/NumberUtils')
const RarityGold = require('./RarityGold')
const RarityCraftingMaterials = require('./RarityCraftingMaterials')
const { rarityEth } = require('./RarityEthereumManager')
const { loadAccounts } = require('./AccountsLoader')

const rarity = new Rarity()
const gold = new RarityGold()
const craftI = new RarityCraftingMaterials()

async function adventure(account, hero, nonce = null) {
  console.log(`${hero} adventure start (account ${account})`)
  try {
    const adventurers_log = await rarity.adventurers_log(hero)
    const { timestamp } = await rarityEth.pendingBlock()
    if (NumberUtils.lte(timestamp, adventurers_log)) {
      console.log(`${hero} adventure canceled, need to wait to timestamp ${adventurers_log}, current timestamp is ${timestamp}`)
      return
    }
    await rarity.adventure(account, hero, nonce)
    const { _xp, _level } = await rarity.summoner(hero)
    const xp_required = await rarity.xp_required(_level)
    // console.log({ adventurers_log, _xp, _level, xp_required })
    if (NumberUtils.gte(_xp, xp_required)) {
      await rarity.level_up(account, hero, nonce)
      console.log(`${hero} adventure level up`)
    }
    console.log(`${hero} adventure complete`)
  } catch (e) {
    console.error(`${hero} adventure error`, e)
  }
}

async function claimGold(account, hero) {
  console.log(`${hero} claimGold start (account ${account})`)
  try {
    const claimable = await gold.claimable(hero)
    if (!NumberUtils.gt(claimable, 0)) {
      console.log(`${hero} claimGold canceled, no gold`)
      return
    }
    await gold.claim(account, hero)
    console.log(`${hero} claimGold claimed ${claimable} gold`)
  } catch (e) {
    console.error(`${hero} claimGold error`, e)
  }
}

async function collectCraftI(account, hero) {
  console.log(`${hero} collectCraft(I) start (account ${account})`)
  try {
    const reward = await craftI.scout(hero)
    if (!NumberUtils.gt(reward, 0)) {
      console.log(`${hero} collectCraft(I) canceled, reward is 0`)
      return
    }
    const { timestamp } = await rarityEth.pendingBlock()
    const adventurers_log = await craftI.adventurers_log(hero)
    if (NumberUtils.lte(timestamp, adventurers_log)) {
      console.log(`${hero} collectCraft(I) canceled, need to wait to timestamp ${adventurers_log}, current timestamp is ${timestamp}`)
      return
    }
    await craftI.adventure(account, hero)
    const balance = await craftI.balanceOf(hero)
    console.log(`${hero} collectCraft(I) complete, balance is ${balance} now`)
  } catch (e) {
    console.error(`${hero} collectCraft(I) error`, e)
  }
}

async function adventureAccount(account, heros) {
  // run serial
  for (const [index, hero] of heros.entries()) {
    // TODO fix "nonce too low" issue and add nonce
    await adventure(account, hero)
    await claimGold(account, hero)
    await collectCraftI(account, hero)
  }
  // run parallel
  // try {
  //   await Promise.map(heros, (hero, index) => {
  //     return adventure(account, hero, index)
  //   }, { concurrency: 20 }) // max about 70 transactions in one ethereum block
  // } catch (e) {
  //   console.error(`account ${account} adventure error`, e)
  // }
}

async function adventureAll(AddressHeros) {
  console.log('adventureAll start')
  for (const { address, heros } of AddressHeros) {
    await adventureAccount(address, heros)
  }
  console.log('adventureAll complete')
}

async function scheduleAdventure(AddressHeros) {
  const CronJob = require('cron').CronJob;
  // second minute hour dayOfMonth month dayOfWeek
  const cron = '0 0 * * * *' // try every 1 hour
  const job = new CronJob(cron, function () {
    adventureAll(AddressHeros)
  }, null, false, 'Asia/Shanghai')
  job.start()
  console.log(`scheduled ${cron}`)
}

async function schedule() {
  const AddressHeros = await loadAccounts()
  scheduleAdventure(AddressHeros)
}

async function adventureNow() {
  const AddressHeros = await loadAccounts()
  adventureAll(AddressHeros)
}

module.exports = {
  schedule,
  adventureNow,
}
