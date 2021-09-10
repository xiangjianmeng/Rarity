/**
 * https://ftmscan.com/address/0xce761d788df608bd21bdd59d6f4b54b2e27f25bb#code
 * https://github.com/andrecronje/rarity
 */
const ContractManager = require("../base/ContractManager");
const GasPriceCalculators = require("../base/GasPriceCalculators");
const Providers = require("../base/Providers");

const CONTRACT_ADDRESS = '0xce761d788df608bd21bdd59d6f4b54b2e27f25bb'
const ABI = require('./abi_rarity.json')

class Rariry extends ContractManager {

  constructor() {
    super(Providers.ftm(), CONTRACT_ADDRESS, ABI)
    this.setGasPriceCalculator(GasPriceCalculators.withDefaultLimit())
  }

  adventure(account, id, nonce = null) {
    return this.write('adventure(uint256)', id, account, { gas: 90000, nonce })
  }

  /**
   * @returns {_xp, _log, _class, _level}
   */
  summoner(id) {
    return this.read('summoner(uint256)', id)
  }

  /**
   * @returns timestamp
   */
  adventurers_log(id) {
    return this.read('adventurers_log(uint256)', id)
  }

  /**
   * @returns xp
   */
  xp(id) {
    return this.read('xp(uint256)', id)
  }

  xp_required(current_level) {
    return this.read('xp_required(uint256)', current_level)
  }

  level_up(account, id, nonce = null) {
    return this.write('level_up(uint256)', id, account, { gas: 90000, nonce })
  }
}

module.exports = Rariry
