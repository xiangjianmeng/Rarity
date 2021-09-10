const path = require('path')
const Providers = require('../base/Providers')
const EthereumManager = require('../base/EthereumManager')

const eth = new EthereumManager(Providers.rinkeby())

const accounts = require(path.resolve('.', 'secrets/test-accounts.json'))

async function test() {
  console.log('Initial account list', eth.accountList())

  for (const account of accounts) {
    console.log(`${account.address} balance`, await eth.balance(account.address))
  }

  for (const account of accounts) {
    await eth.addAccount(account.privateKey)
  }
  console.log('Account list', eth.accountList())

  // eth.send(accounts[0].address, accounts[1].address, '1e17')
  //   .then(console.log)
  //   .catch(console.error)
}

test()
