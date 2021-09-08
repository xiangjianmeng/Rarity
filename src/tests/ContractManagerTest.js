const Providers = require('../base/Providers')
const ContractManager = require('../base/ContractManager')

const ABI = null
const CONTRACT_ADDRESS = null
const contract = new ContractManager(Providers.rinkeby(), CONTRACT_ADDRESS, ABI)

const testAccounts = require('../../secrets/test_accounts.json')

async function test() {
  console.log(contract.accountList())
  // const key = testAccounts.account1.key
  // await contract.addAccount(key)
  //   .then(console.log)
  //   .catch(console.error)
  // console.log(contract.accountList())
  // contract.send(testAccounts.account1.address, testAccounts.account2.address, '0.1')
  //   .then(console.log)
  //   .catch(console.error)
}

test()
