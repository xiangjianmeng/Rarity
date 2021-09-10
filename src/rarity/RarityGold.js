/**
 * https://ftmscan.com/address/0x2069B76Afe6b734Fb65D1d099E7ec64ee9CC76B2#code
 * https://github.com/andrecronje/rarity
 */
const ContractManager = require("../base/ContractManager");
const GasPriceCalculators = require("../base/GasPriceCalculators");
const Providers = require("../base/Providers");

const CONTRACT_ADDRESS = '0x2069B76Afe6b734Fb65D1d099E7ec64ee9CC76B2'
const ABI = require('./abi_rarity_gold.json')

class RariryGold extends ContractManager {

  constructor() {
    super(Providers.ftm(), CONTRACT_ADDRESS, ABI)
    this.setGasPriceCalculator(GasPriceCalculators.withDefaultLimit())
  }

  claimable(id) {
    return this.read('claimable(uint256)', id)
  }

  claim(account, id) {
    return this.write('claim(uint256)', id, account)
  }

}

module.exports = RariryGold
