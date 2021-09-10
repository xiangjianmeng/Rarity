/**
 * batch check ether balance
 * Usage:   node src/scripts/batch-check-ether.js ACCOUNT_LIST_JSON_FILE
 * Example: node src/scripts/batch-check-ether.js accounts.json
 */
const path = require('path')
const Providers = require('../base/Providers')
const ContractManager = require('../base/ContractManager')
const contract = new ContractManager(Providers.ftm(), null, null)

async function main() {
  console.log(process.argv)

  if (process.argv.length != 3) {
    console.log('Usage:   node src/scripts/batch-check-ether.js ACCOUNT_LIST_JSON_FILE')
    console.log('Example: node src/scripts/batch-check-ether.js accounts.json')
    return
  }

  const accounts = require(path.resolve('.', process.argv[2]))

  for (const account of accounts) {
    const balance = await contract.balance(account.address, true)
    console.log(`account ${account.address} balance is ${balance} Ether`)
  }
}

main()
