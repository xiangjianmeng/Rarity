const path = require('path')
const Providers = require('../base/Providers')
const EthereumManager = require('../base/EthereumManager')
const NumberUtils = require('../base/NumberUtils')

const eth = new EthereumManager(Providers.rinkeby())

const accounts = require(path.resolve('.', 'secrets/test-accounts.json'))

async function test() {
  const gasPrice = await eth.gasPrice()
  console.log(gasPrice)
  console.log(NumberUtils.gt(gasPrice, 50e9)) // 50Gwei
  console.log(NumberUtils.lt(gasPrice, 100e9)) // 100Gwei

  console.log('Initial account list', eth.accountList())

  for (const account of accounts) {
    console.log(`${account.address} balance`, await eth.balance(account.address))
  }

  for (const account of accounts) {
    await eth.addAccount(account.privateKey)
  }
  console.log('Account list', eth.accountList())

  const count = await eth.transactionCount(accounts[0].address)
  console.log(`transaction count = ${count}`)

  // eth.send(accounts[0].address, accounts[1].address, '1e17') // 1e17 = 0.1Ether
  //   .then(console.log)
  //   .catch(console.error)
}

test()
