/**
 * Calculate gas price
 */

const NumberUtils = require("./NumberUtils")

/**
 * https://web3js.readthedocs.io/en/v1.5.2/web3-eth.html#getgasprice
 * @returns {String} current gas price in wei.
 */
function getCurrentPrice(web3) {
  return web3.eth.getGasPrice()
}

class GasPriceCalculators {

  static useCurrent() {
    return (web3, price) => getCurrentPrice(web3)
  }

  static withDefaultLimit() {
    return GasPriceCalculators.withLimit(80e9)
  }

  /**
   * use currentPrice or maxPrice
   * @param {Number} maxPrice max gas price in wei
   */
   static withLimit(maxPrice) {
    return async function (web3, price) {
      const currentPrice = await getCurrentPrice(web3)
      // try maxPrice and wait, web3 will wait with transactionPollingTimeout
      if (NumberUtils.gt(currentPrice, maxPrice)) {
        console.log(`current gas price is ${currentPrice}, try to use ${maxPrice}`)
        return maxPrice
      }
      // use currentPrice
      console.log(`use current gas price ${currentPrice}`)
      return currentPrice
    }
  }

  /**
   * use currentPrice or maxPrice or abort transaction
   * @param {Number} maxPrice max gas price in wei
   * @param {Number|null} abortPrice abort transaction if current gas price is lager than this
   */
  static withAbortLimit(maxPrice, abortPrice) {
    return async function (web3, price) {
      const currentPrice = await getCurrentPrice(web3)
      // if currentPrice > abortPrice, abort the transaction
      if (NumberUtils.gt(currentPrice, abortPrice)) {
        throw Error(`current gas price is ${currentPrice} > ${abortPrice}, abort transaction`)
      }
      // try maxPrice and wait, web3 will wait with transactionPollingTimeout
      if (NumberUtils.gt(currentPrice, maxPrice)) {
        console.log(`current gas price is ${currentPrice}, try to use ${maxPrice}`)
        return maxPrice
      }
      // use currentPrice
      console.log(`use current gas price ${currentPrice}`)
      return currentPrice
    }
  }
}

module.exports = GasPriceCalculators
