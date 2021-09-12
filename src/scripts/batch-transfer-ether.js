/**
 * batch transfer ether
 * Usage:   node src/scripts/batch-transfer-ether.js SRC_ACCOUNT DST_ACCOUNT_LIST ETHER_IN_WEI
 * Example: node src/scripts/batch-transfer-ether.js src-account.json dst-accounts.json 5e18
 */
const path = require('path')
const BigNumber = require('bignumber.js')
const Providers = require('../base/Providers')
const EthereumManager = require('../base/EthereumManager')
const logger = require('../base/logger')
const eth = new EthereumManager(Providers.ftm(), null, null)

async function main() {
  logger.info(process.argv)

  if (process.argv.length != 5) {
    logger.info('Usage:   node src/scripts/batch-transfer-ether.js SRC_ACCOUNT DST_ACCOUNT_LIST ETHER_IN_WEI')
    logger.info('Example: node src/scripts/batch-transfer-ether.js src-account.json dst-accounts.json 5e18')
    return
  }

  const srcAccounts = require(path.resolve('.', process.argv[2]))
  const srcAccount = await eth.addAccount(srcAccounts[0].privateKey)
  if (srcAccount !== srcAccounts[0].address) {
    throw Error(`src account import failed`)
  }

  const dstAccounts = require(path.resolve('.', process.argv[3]))
  const value = BigNumber(process.argv[4])

  for (const account of dstAccounts) {
    logger.info(`send ${value} wei from ${srcAccount} to ${account.address} ...`)
    await eth.send(srcAccount, account.address, value)
  }
  logger.info('complete')
}

main()
