const Web3 = require('web3')

const debug = () => { }
// const debug = console.log

/**
 * General ethereum manager
 * Be caucious: web3 returns uint256 as string instead of number
 *
 * https://web3js.readthedocs.io/en/v1.5.2
 * https://eth.wiki/json-rpc/API
 */
class EthereumManager {

  /**
   * @param {*} provider ethereum provider, e.g. window.ethereum for metamask env
   * @param {Object|null} options {
   *   transactionConfirmationBlocks: 1,
   *   transactionBlockTimeout: 60,
   *   transactionPollingTimeout: 480
   * };
   */
  constructor(provider, options = {
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 60,
    transactionPollingTimeout: 480
  }) {
    if (!provider) throw new Error('Provider is empty!')
    this.web3 = new Web3(provider, null, options)
  }

  /**
   * @param {Function} calculator async function to calc gas price
   *        args: (web3, gasPriceArgs),
   *        return gas price for transaction,
   *        return null or throw Error to abort transaction
   */
  setGasPriceCalculator(calculator) {
    this.gasPriceCalculator = calculator
  }

  /**
   * https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html#getgasprice
   * @returns {String} current gas price in wei.
   */
  gasPrice() {
    return this.web3.eth.getGasPrice()
  }

  /**
   * @param {*} convertToEther true for ETH, false for wei
   */
  async balance(address, convertToEther = false) {
    const balance = await this.web3.eth.getBalance(address)
    if (convertToEther) {
      return Web3.utils.fromWei(balance)
    } else {
      return balance
    }
  }

  /**
   * @returns
   * {
   *   difficulty: '0',
   *   extraData: '0x',
   *   gasLimit: 281474976710655,
   *   gasUsed: 3417150,
   *   hash: '0x00008095000004ce083e7cff9b8ced92b4463766ac28c31197dc88dc7a67e2e7',
   *   logsBloom: '0x00000200000000000200000000200008000000000000000000000100008000008000000000000000088000000842000000000010000002000000000400220081000000000000000000000008000080000000000000000000000008000000000000000000029000000000000001000800000000080080000000000090000000080000000100000000000000090000000000010000000000000000000000000801220010000000000000000800000c00000000000000000000000000000000000000000002000001080000000001000200000000000000000000000000440020000010000000000000000000020200000000001004005000000000200000100006',
   *   miner: '0x0000000000000000000000000000000000000000',
   *   mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
   *   nonce: '0x0000000000000000',
   *   number: 16669965,
   *   parentHash: '0x00008095000004baab544f22c707c65fce8a7666f173f4a626a24d9791f7ffb7',
   *   receiptsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
   *   sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
   *   size: 21916,
   *   stateRoot: '0x57404cb2fe8303d7ce6eae0fbf6ebb9bfcc8d3fdc7ffa75694b279caf4eda397',
   *   timestamp: 1631099836,
   *   timestampNano: '0x16a2d4a8e1b3f40c',
   *   totalDifficulty: '0',
   *   transactions: [
   *     '0xb7b955c7b5136ce20c12074860c988aaf1073cd40d876663ffc2ff9a3455b9d5',
   *     ...
   *   ],
   *   transactionsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
   *   uncles: []
   * }
   */
  async latestBlock() {
    return this.web3.eth.getBlock('latest')
  }

  async pendingBlock() {
    return this.web3.eth.getBlock('pending')
  }

  /**
   * add account privateKey and set it as default account
   * @param {String} privateKey
   * https://web3js.readthedocs.io/en/v1.5.2/web3-eth-accounts.html#wallet
   */
  async addAccount(privateKey) {
    const r = await this.web3.eth.accounts.wallet.add(privateKey)
    const address = r.address
    this.account = address
    return address
  }

  /**
   * https://learnblockchain.cn/docs/web3.js/web3-eth-accounts.html#create
   * @param {*} count
   * @returns [{address, privateKey, signTransaction, sign, encrypt}]
   */
  createAccounts(count) {
    const accounts = []
    for (let i = 0; i < count; ++i) {
      accounts.push(this.web3.eth.accounts.create())
    }
    return accounts
  }

  /**
   * get account address list
   * @returns string array
   *
   * Wallet {
   *   0: {...}, // account by index
   *   "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55": {...},  // same account by address
   *   "0xf0109fc8df283027b6285cc889f5aa624eac1f55": {...},  // same account by address lowercase
   *   1: {...},
   *   "0xD0122fC8DF283027b6285cc889F5aA624EaC1d23": {...},
   *   "0xd0122fc8df283027b6285cc889f5aa624eac1d23": {...},
   *
   *   add: function(){},
   *   remove: function(){},
   *   save: function(){},
   *   load: function(){},
   *   clear: function(){},
   *
   *   length: 2,
   * }
   */
  accountList() {
    const wallet = this.web3.eth.accounts.wallet
    return Array.from(Array(wallet.length).keys()).map(i => wallet[i].address)
  }

  transactionCount(address) {
    return this.web3.eth.getTransactionCount(address)
  }

  /**
   * send ether to another account
   * https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html#sendtransaction
   *
   * @param {String} from from address or null for default
   * @param {String} to to address
   * @param {String} value amount in wei
   * @returns {Promise<Object>}
   * {
   *   blockHash: '0x53dxxx',
   *   blockNumber: 924xxx,
   *   contractAddress: null,
   *   cumulativeGasUsed: 7021519,
   *   effectiveGasPrice: '0x3b9aca08',
   *   from: '0xd0c2002xxx',
   *   gasUsed: 21000,
   *   logs: [],
   *   logsBloom: '0x00000000000000xxx',
   *   status: true,
   *   to: '0xd164xxxx',
   *   transactionHash: '0xa0333cxxxx',
   *   transactionIndex: 25,
   *   type: '0x2'
   * }
   */
  async send(from, to, value, { gas, gasPrice, nonce } = { gas: 21000 }) {
    from = from || this.account
    if (!from) throw Error('From account is empty!')
    if (!to) throw Error('To account is empty!')
    gasPrice = await this.calcGasPrice(gasPrice)
    if (nonce === null || nonce === undefined) nonce = await this.transactionCount(from)
    console.log(`===> send ${value} ether from ${from} to ${to}, gasLimit: ${gas}, gasPrice: ${gasPrice}, nonce: ${nonce}`)
    return this.web3.eth.sendTransaction({ from, to, value, gas, gasPrice, nonce })
  }

  /**
   * throw error if gas price not suit the needs
   */
  async calcGasPrice(gasPrice) {
    if (this.gasPriceCalculator) {
      gasPrice = await this.gasPriceCalculator(this.web3, gasPrice)
      if (!gasPrice) {
        throw Error('Gas price is null, abort transaction')
      }
    }
    return gasPrice
  }

  getWeb3() {
    return this.web3
  }
}

module.exports = EthereumManager
