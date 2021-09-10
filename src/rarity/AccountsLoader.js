const fs = require('fs')
const path = require('path')
const csv = require('csvtojson')
const { rarityEth } = require('./RarityEthereumManager')
const Rarity = require('./Rarity')

const secretsDir = path.resolve(__dirname, '../../secrets/')

async function loadAccounts() {
  console.log('loadAccounts start')
  const AddressHeros = [] // [{ address, heros[] }]
  const accounts = require(path.resolve(secretsDir, 'rarity-accounts.json'))
  const files = fs.readdirSync(secretsDir)
  for (const account of accounts) {
    try {
      const address = await rarityEth.addAccount(account.privateKey)
      if (address !== account.address) {
        throw Error(`import account ${account.address} failed`)
      }
      const file = files.find(s => s.toLowerCase().includes(address.toLowerCase()))
      if (file) {
        const csvData = await csv().fromFile(path.resolve(secretsDir, file))
        const heros = csvData.filter(a => a.ContractAddress === Rarity.CONTRACT_ADDRESS).map(a => a.TokenId)
        AddressHeros.push({ address, heros })
      }
    } catch (e) {
      console.error('load account error', e)
    }
  }
  console.log('loadAccounts complete', AddressHeros)
  return AddressHeros
}

module.exports = {
  loadAccounts
}

loadAccounts()
