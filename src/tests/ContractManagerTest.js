/**
 * TestContract:
 * https://rinkeby.etherscan.io/address/0x18d61a8A9C14B262CD2D0898b072EaC7293DBeAB#code
 */

const ContractManager = require("../base/ContractManager");
const EthereumManager = require("../base/EthereumManager");
const Providers = require("../base/Providers");

const ADDRESS = '0x18d61a8A9C14B262CD2D0898b072EaC7293DBeAB'
const ABI = require('./ContractManagerTestABI.json')

class TestContract extends ContractManager {

  constructor(eth) {
    super(eth, ADDRESS, ABI)
  }

  _read(arg1, arg2) {
    return this.read('read(uint256,uint256)', [arg1, arg2])
  }

  value() {
    return this.read('value', [])
  }

  _write(account, arg1, arg2) {
    return this.write('write(uint256,uint256)', [arg1, arg2], account)
  }
}

async function test() {
  const eth = new EthereumManager(Providers.rinkeby());
  const contract = new TestContract(eth)

  console.log(contract.contract.methods)

  const account = require('../../secrets/test-account-1.json')[0]
  await eth.addAccount(account.privateKey)

  const r1 = await contract._read(1, 2)
  console.log(r1) // {ret1: '2', ret2: '3'}
  const r2 = await contract._write(account.address, 2, 3)
  console.log(r2) // {ret1: '3', ret2: '4'}
  const r3 = await contract.value()
  console.log(r3) // '2'
}

test()
