
const Providers = require('../base/Providers')
const ContractManager = require('../base/ContractManager')
const NumberUtils = require('../base/NumberUtils')
const contract = new ContractManager(Providers.ftm(), null, null)

async function main() {
  const gasPrice = await contract.gasPrice()
  console.log(gasPrice)
  console.log(NumberUtils.gt(gasPrice, 50e9)) // 50Gwei
  console.log(NumberUtils.lt(gasPrice, 100e9)) // 100Gwei
}

main()
