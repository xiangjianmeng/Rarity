const BigNumber = require('bignumber.js')

class NumberUtils {
  /**
   * @returns true if a > b
   */
  static gt(a, b) {
    return BigNumber(a).gt(BigNumber(b))
  }

  /**
   * @returns true if a < b
   */
  static lt(a, b) {
    return BigNumber(a).lt(BigNumber(b))
  }

  /**
   * @returns true if a >= b
   */
  static gte(a, b) {
    return BigNumber(a).gte(BigNumber(b))
  }

  /**
   * @returns true if a <= b
   */
  static lte(a, b) {
    return BigNumber(a).lte(BigNumber(b))
  }
}

module.exports = NumberUtils
