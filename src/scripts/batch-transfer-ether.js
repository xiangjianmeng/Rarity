/**
 * batch create accounts
 * usage: node src/scripts/batch-create-accounts.js 100 batch-accounts.json
 */

const Providers = require('../base/Providers')
const ContractManager = require('../base/ContractManager')
const contract = new ContractManager(Providers.ftm(), null, null)

function main() {
  console.log(process.argv)
  const srcAccountPrivateKey = process.argv[2]
  const dstAccountListFile = process.argv[3] || 'dst.json'
  const value = process.argv[4]
  const srcAccount = await contract.addAccount(srcAccountPrivateKey)
  const dstAccounts = require(dstAccountListFile).map(i => i.address)
  for (address of dstAccounts) {
    console.log(`send ${value} wei from ${srcAccount} to ${address} ...`)
    await contract.send(srcAccount, address, value)
  }
  console.log('complete')
}

main()
