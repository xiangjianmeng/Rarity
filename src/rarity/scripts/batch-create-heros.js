/**
 * Batch create heros
 * Usage:   node src/rarity/scripts/batch-create-heros.js ACCOUNT_LIST_JSON_FILE HERO_COUNT_PER_ACCOUNT
 * Example: node src/rarity/scripts/batch-create-heros.js secrets/accounts.json 11
 */
const { delay } = require('bluebird')
const path = require('path')
const GasPriceCalculators = require('../../base/GasPriceCalculators')
const Rarity = require('../Rarity')
const { rarityEth } = require('../RarityEthereumManager')
const rarity = new Rarity()
// change here to use different gas price strategy
rarity.setGasPriceCalculator(GasPriceCalculators.withDefaultLimit())

async function main() {
  console.log(process.argv)

  if (process.argv.length != 4) {
    console.log('Usage:   node src/rarity/scripts/batch-create-heros.js ACCOUNT_LIST_JSON_FILE HERO_COUNT_PER_ACCOUNT')
    console.log('Example: node src/rarity/scripts/batch-create-heros.js secrets/accounts.json 11')
    return
  }

  const accounts = require(path.resolve('.', process.argv[2]))
  const heroCount = Number(process.argv[3])

  console.log(`will mint ${heroCount} heros for each of ${accounts.length} accounts`)

  for (const account of accounts) {
    const address = await rarityEth.addAccount(account.privateKey)
    if (address !== account.address) {
      console.error(`account ${address} import failed`)
      continue
    }
    console.log(`min heros for account ${address}`)
    for (let i = 0; i < heroCount; ++i) {
      const _class = i % 11 + 1
      console.log(`mint hero ${i} with class ${_class} for account ${address}`)
      try {
        await rarity.summon(address, _class)
        // delay 1s to avoid web3 'nonce too low' error
        await delay(1000)
      } catch (e) {
        console.error(`mint hero ${i} with class ${_class} for account ${address} failed`, e)
      }
    }
  }
  console.log(`complete`)
}

main()
