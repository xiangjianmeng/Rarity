/**
 * batch create accounts
 * usage: node src/scripts/batch-create-accounts.js 100 batch-accounts.json
 */

const Providers = require('../base/Providers')
const ContractManager = require('../base/ContractManager')
const contract = new ContractManager(Providers.ftm(), null, null)

function main() {
  console.log(process.argv)
  const count = Number(process.argv[2] || 10)
  const file = process.argv[3] || 'output.json'
  const accounts = contract.createAccounts(count)
  const data = accounts.map(a => { return { address: a.address, privateKey: a.privateKey } })
  const json = JSON.stringify(data, null, 2)
  require('fs').writeFileSync(file, json, { encoding: 'utf-8' })
  console.log(`create ${count} accounts complete, output to file ${file}`)
}

main()
