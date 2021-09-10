/**
 * https://ftmscan.com/address/0x2A0F1cB17680161cF255348dDFDeE94ea8Ca196A#code
 * https://github.com/andrecronje/rarity
 */
const ContractManager = require("../base/ContractManager");
const GasPriceCalculators = require("../base/GasPriceCalculators");
const Providers = require("../base/Providers");

const CONTRACT_ADDRESS = '0x2A0F1cB17680161cF255348dDFDeE94ea8Ca196A'
const ABI = require('./abi_rarity_crafting_materials.json')

class RariryCraftingMaterials extends ContractManager {

  constructor() {
    super(Providers.ftm(), CONTRACT_ADDRESS, ABI)
    this.setGasPriceCalculator(GasPriceCalculators.withDefaultLimit())
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

module.exports = RariryCraftingMaterials
