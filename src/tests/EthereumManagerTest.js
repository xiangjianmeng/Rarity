const path = require('path')
const Providers = require('../base/Providers')
const EthereumManager = require('../base/EthereumManager')
const NumberUtils = require('../base/NumberUtils')
const logger = require('../base/logger')

const eth = new EthereumManager(Providers.rinkeby())

const accounts = require(path.resolve('.', 'secrets/test-accounts.json'))

async function test() {
  const gasPrice = await eth.gasPrice()
  logger.info(gasPrice)
  logger.info(NumberUtils.gt(gasPrice, 50e9)) // 50Gwei
  logger.info(NumberUtils.lt(gasPrice, 100e9)) // 100Gwei

  logger.info('Initial account list', eth.accountList())

  for (const account of accounts) {
    logger.info(`${account.address} balance`, await eth.balance(account.address))
  }

  for (const account of accounts) {
    await eth.addAccount(account.privateKey)
  }
  logger.info('Account list', eth.accountList())

  const count = await eth.transactionCount(accounts[0].address)
  logger.info(`transaction count = ${count}`)

  // eth.send(accounts[0].address, accounts[1].address, '1e17') // 1e17 = 0.1Ether
  //   .then(logger.info)
  //   .catch(logger.error)
}

test()
