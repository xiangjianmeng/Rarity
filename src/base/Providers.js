const Web3 = require('web3')

module.exports = {
  // infura url copied from metamask
  ethereum: () => new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
  ropsten: () => new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
  rinkeby: () => new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
  goerli: () => new Web3.providers.HttpProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
  kovan: () => new Web3.providers.HttpProvider('https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),

  xdai: () => new Web3.providers.HttpProvider('https://rpc.xdaichain.com'),
  // Matic(Polygon)
  matic: () => new Web3.providers.HttpProvider('https://rpc-mainnet.maticvigil.com/'),
  // Fantom Opera
  ftm: () => new Web3.providers.HttpProvider('https://rpc.ftm.tools/'),
}
