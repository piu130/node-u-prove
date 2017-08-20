const {BigInteger} = require('jsbn')

/**
 * Constructs a new subgroup.
 */
class Subgroup {
  /**
   * Constructor.
   * @param {string} p - Field order.
   * @param {string} q - Prime order.
   * @param {string} g - Generator.
   */
  constructor (p, q, g) {
    this.p = new BigInteger(p, 16)
    this._validateP()
    this.q = new BigInteger(q, 16)
    this._validateQ()
    this.g = new BigInteger(g, 16)
    this._validateG()
  }

  /**
   * Checks if number is included in the group.
   * @param {BigInteger} number - Number to check.
   * @returns {boolean} True if included, otherwise false.
   */
  includes (number) {
    return number.compareTo(this.p) < 0 && number.modPow(this.q, this.p).equals(BigInteger.ONE)
  }

  /**
   * Checks if p is prime.
   * @returns {boolean} True if valid, otherwise false.
   */
  _validateP () {
    if (!this.p.isProbablePrime()) throw new RangeError('p is not a prime.')
  }

  /**
   * Checks if q is prime. And q divides p - 1.
   * @returns {boolean} True if valid, otherwise false.
   */
  _validateQ () {
    if (!this.q.isProbablePrime()) throw new RangeError('q is not a prime.')
    if (!this.p.subtract(BigInteger.ONE).mod(this.q).equals(BigInteger.ZERO)) throw new RangeError('q does not divide p - 1.')
  }

  /**
   * Checks if g is element of Gq and g !== 1.
   * @returns {boolean} True if valid, otherwise false.
   */
  _validateG () {
    if (!this.includes(this.g)) throw new RangeError('g is not element of Gq.')
    if (this.g.equals(BigInteger.ONE)) throw new RangeError('g must not be one.')
  }
}

module.exports = Subgroup
