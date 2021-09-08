const fs = require('fs')
const path = require('path')
const csv = require('csvtojson')
const Rarity = require('./Rarity')
const NumberUtils = require('../base/NumberUtils')

const rarity = new Rarity()

const AccountHeros = []
const secretsDir = path.resolve(__dirname, '../../secrets/')

const CONTRACT_ADDRESS = '0xce761d788df608bd21bdd59d6f4b54b2e27f25bb'

async function loadAccounts() {
  console.log('loadAccounts start')
  const keys = require(path.resolve(secretsDir, 'rarity_accounts.json')).privateKeys
  const files = fs.readdirSync(secretsDir)
  for (const key of keys) {
    try {
      const account = await rarity.addAccount(key)
      const file = files.find(s => s.includes(account.toLowerCase()))
      if (file) {
        const csvData = await csv().fromFile(path.resolve(secretsDir, file))
        const heros = csvData.filter(a => a.ContractAddress === CONTRACT_ADDRESS).map(a => a.TokenId)
        AccountHeros.push({ account, heros })
      }
    } catch (e) {
      console.error('load account error', e)
    }
  }
  console.log('loadAccounts complete', AccountHeros)
}

async function adventure(account, id) {
  console.log(`${id} adventure start (account ${account})`)
  try {
    const adventurers_log = await rarity.adventurers_log(id)
    const { timestamp } = await rarity.pendingBlock()
    if (NumberUtils.lte(timestamp, adventurers_log)) {
      console.log(`${id} adventure canceled, need to wait to timestamp ${adventurers_log}, current timestamp is ${timestamp}`)
      return
    }
    await rarity.adventure(account, id)
    const { _xp, _level } = await rarity.summoner(id)
    const xp_required = await rarity.xp_required(_level)
    // console.log({ adventurers_log, _xp, _level, xp_required })
    if (NumberUtils.gte(_xp, xp_required)) {
      await rarity.level_up(account, id)
      console.log(`${id} adventure level up`)
    }
    console.log(`${id} adventure complete`)
  } catch (e) {
    console.error(`${id} adventure error`, e)
  }
}

async function adventureAll() {
  console.log('adventureAll start')
  for (const { account, heros } of AccountHeros) {
    // run serial
    for (const hero of heros) {
      await adventure(account, hero)
    }
    // run parallel
    // await Promise.map(heros, hero => {
    //   return adventure(account, hero)
    // })
  }
  console.log('adventureAll complete')
}

async function scheduleAdventure() {
  const CronJob = require('cron').CronJob;
  const job = new CronJob('0 0 0 * * *', function () {
    adventureAll()
  }, null, false, 'Asia/Shanghai')
  job.start()
  console.log('scheduled 0 0 0 * * *')
}

async function schedule() {
  await loadAccounts()
  scheduleAdventure()
}

async function adventureNow() {
  await loadAccounts()
  adventureAll()
}

module.exports = {
  schedule,
  adventureNow,
}
