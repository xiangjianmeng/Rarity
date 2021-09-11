/**
 * Manually create hero for an account
 * Usage:   node src/rarity/scripts/manually-create-hero.js ACCOUNT_LIST_JSON_FILE address class
 * Example: node src/rarity/scripts/manually-create-hero.js secrets/accounts.json 0x123...456 5
 */
const path = require('path')
const GasPriceCalculators = require('../../base/GasPriceCalculators')
const Rarity = require('../Rarity')
const { rarityEth } = require('../RarityEthereumManager')
const rarity = new Rarity()
// change here to use different gas price strategy
rarityEth.setGasPriceCalculator(GasPriceCalculators.withDefaultPassable())

async function main() {
  console.log(process.argv)

  if (process.argv.length != 5) {
    console.log('Usage:   node src/rarity/scripts/manually-create-hero.js ACCOUNT_LIST_JSON_FILE ADDRESS class')
    console.log('Example: node src/rarity/scripts/manually-create-hero.js secrets/accounts.json 0x123...456 5')
    return
  }

  const accounts = require(path.resolve('.', process.argv[2]))
  const address = process.argv[3]
  const heroClass = Number(process.argv[4])

  for (const account of accounts) {
    if (address === account.address) {
      const importAddress = await rarityEth.addAccount(account.privateKey)
      if (address !== importAddress) {
        console.error(`account import failed`)
        return
      }
      console.log(`mint hero with class ${heroClass} for account ${address}`)
      try {
        await rarity.summon(address, heroClass)
        console.log('complete')
      } catch (e) {
        console.error(`mint hero failed`, e)
      }
      return
    }
  }
  console.log(`address not found in address json file`)
}

main()
