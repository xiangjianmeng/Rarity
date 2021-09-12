/**
 * https://ftmscan.com/address/0x6292f3fB422e393342f257857e744d43b1Ae7e70#code
 * https://github.com/andrecronje/rarity
 */
const ContractManager = require("../../base/ContractManager")
const { rarityEth } = require("../RarityEthereumManager")

class RaritySkills extends ContractManager {

  static CONTRACT_ADDRESS = '0x6292f3fB422e393342f257857e744d43b1Ae7e70'
  static ABI = require('./abi_rarity_skills.json')

  constructor() {
    super(rarityEth, RaritySkills.CONTRACT_ADDRESS, RaritySkills.ABI)
  }

}

module.exports = RaritySkills
