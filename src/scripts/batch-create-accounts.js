/**
 * batch create accounts
 * Usage:   node src/scripts/batch-create-accounts.js COUNT ACCOUNT_LIST_JSON_FILE
 * Example: node src/scripts/batch-transfer-ether.js 10 secrets/accounts.json
 */

const Providers = require('../base/Providers')
const EthereumManager = require('../base/EthereumManager')
const logger = require('../base/logger')
const eth = new EthereumManager(Providers.ftm(), null, null)

function main() {
  logger.info(process.argv)

  if (process.argv.length != 4) {
    logger.info('Usage:   node src/scripts/batch-create-accounts.js COUNT ACCOUNT_LIST_JSON_FILE')
    logger.info('Example: node src/scripts/batch-transfer-ether.js 10 secrets/accounts.json')
    return
  }

  const count = Number(process.argv[2] || 10)
  const file = process.argv[3] || 'output.json'
  const accounts = eth.createAccounts(count)
  const data = accounts.map(a => { return { address: a.address, privateKey: a.privateKey } })
  const json = JSON.stringify(data, null, 2)
  require('fs').writeFileSync(file, json, { encoding: 'utf-8' })
  logger.info(`create ${count} accounts complete, output to file ${file}`)
}

main()
