/**
 * batch transfer ether
 * Usage:   node src/scripts/batch-transfer-ether.js SRC_ACCOUNT DST_ACCOUNT_LIST ETHER_IN_WEI
 * Example: node src/scripts/batch-transfer-ether.js src-account.json dst-accounts.json 5e18
 */
const path = require('path')
const BigNumber = require('bignumber.js')
const Providers = require('../base/Providers')
const ContractManager = require('../base/ContractManager')
const contract = new ContractManager(Providers.ftm(), null, null)

async function main() {
  console.log(process.argv)

  if (process.argv.length != 5) {
    console.log('Usage:   node src/scripts/batch-transfer-ether.js SRC_ACCOUNT DST_ACCOUNT_LIST ETHER_IN_WEI')
    console.log('Example: node src/scripts/batch-transfer-ether.js src-account.json dst-accounts.json 5e18')
    return
  }

  const srcAccounts = require(path.resolve('.', process.argv[2]))
  const srcAccount = await contract.addAccount(srcAccounts[0].privateKey)
  if (srcAccount !== srcAccounts[0].address) {
    throw Error(`src account import failed`)
  }

  const dstAccounts = require(path.resolve('.', process.argv[3]))
  const value = BigNumber(process.argv[4])

  for (const account of dstAccounts) {
    console.log(`send ${value} wei from ${srcAccount} to ${account.address} ...`)
    await contract.send(srcAccount, account.address, value)
  }
  console.log('complete')
}

main()
