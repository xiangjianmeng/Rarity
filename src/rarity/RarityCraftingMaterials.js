/**
 * https://ftmscan.com/address/0x2A0F1cB17680161cF255348dDFDeE94ea8Ca196A#code
 * https://github.com/andrecronje/rarity
 */
const ContractManager = require("../base/ContractManager")
const { rarityEth } = require("./RarityEthereumManager")

class RarityCraftingMaterials extends ContractManager {

  static CONTRACT_ADDRESS = '0x2A0F1cB17680161cF255348dDFDeE94ea8Ca196A'
  static ABI = require('./abi_rarity_crafting_materials.json')

  constructor() {
    super(rarityEth, RarityCraftingMaterials.CONTRACT_ADDRESS, RarityCraftingMaterials.ABI)
  }

  adventurers_log(hero) {
    return this.read('adventurers_log(uint256)', hero)
  }

  adventure(account, hero) {
    return this.write('adventure(uint256)', hero, account)
  }

  balanceOf(hero) {
    return this.read('balanceOf(uint256)', hero)
  }
}

module.exports = RarityCraftingMaterials
