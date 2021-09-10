/**
 * batch transfer ether
 * usage: node src/scripts/batch-transfer-ether.js src-accounts.json dst-accounts.json 5
 */
const path = require('path')
const BigNumber = require('bignumber.js')
const Providers = require('../base/Providers')
const ContractManager = require('../base/ContractManager')
const contract = new ContractManager(Providers.rinkeby(), null, null)

async function main() {
  console.log(process.argv)

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
