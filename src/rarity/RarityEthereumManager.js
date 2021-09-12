const EthereumManager = require("../base/EthereumManager")
const GasPriceCalculators = require("../base/GasPriceCalculators")
const Providers = require("../base/Providers")

const rarityEth = new EthereumManager(Providers.ftm())
rarityEth.setGasPriceCalculator(GasPriceCalculators.default())

module.exports = {
  rarityEth
}
