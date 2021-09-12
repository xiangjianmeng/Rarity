/**
 * batch check ether balance
 * Usage:   node src/scripts/batch-check-ether.js ACCOUNT_LIST_JSON_FILE
 * Example: node src/scripts/batch-check-ether.js accounts.json
 */
const path = require('path')
const Providers = require('../base/Providers')
const EthereumManager = require('../base/EthereumManager')
const logger = require('../base/logger')
const eth = new EthereumManager(Providers.ftm(), null, null)

async function main() {
  logger.info(process.argv)

  if (process.argv.length != 3) {
    logger.info('Usage:   node src/scripts/batch-check-ether.js ACCOUNT_LIST_JSON_FILE')
    logger.info('Example: node src/scripts/batch-check-ether.js accounts.json')
    return
  }

  const accounts = require(path.resolve('.', process.argv[2]))

  for (const account of accounts) {
    const balance = await eth.balance(account.address, true)
    logger.info(`account ${account.address} balance is ${balance} Ether`)
  }
}

main()
