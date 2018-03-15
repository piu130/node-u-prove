const {BigInteger} = require('jsbn')
const {computeVerifiablyRandomElementSubgroup} = require('./functions')
const IntegerGroup = require('./IntegerGroup')

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
    this.validateP()
    this.q = new BigInteger(q, 16)
    this.validateQ()
    this.g = new BigInteger(g, 16)
    this.validateGenerator(this.g)
    this.Gq = new IntegerGroup(this.p)
    this.Zq = new IntegerGroup(this.q)
  }

  /**
   * The identity element of this group.
   */
  get identityElement () {
    return this.Gq.createFromBigInteger(BigInteger.ONE)
  }

  /**
   * Computes a verifiably random element.
   * @param {string} UIDh - Hash identifier.
   * @param {string} context - Context.
   * @param {number} index - Index.
   * @returns {BigInteger} Verifiably random element.
   */
  computeVerifiablyRandomElement (UIDh, context, index) {
    return computeVerifiablyRandomElementSubgroup({UIDh, descGq: this}, context, index)
  }

  /**
   * Checks if number is included in the group (doc x element Gq).
   * @param {BigInteger} number - Number to check.
   * @returns {boolean} True if included, otherwise false.
   */
  includes (number) {
    return number.compareTo(this.p) < 0
  }

  /**
   * Checks if number is included in the group (doc x^q mod p = 1). Much slower than includes().
   * @param {BigInteger} number - Number to check.
   * @returns {boolean} True if included, otherwise false.
   */
  secureIncludes (number) {
    return number.compareTo(this.p) < 0 && number.modPow(this.q, this.p).equals(BigInteger.ONE)
  }

  /**
   * Checks if p is prime.
   * @returns {void} Nothing.
   */
  validateP () {
    if (!this.p.isProbablePrime()) throw new RangeError('p is not a prime.')
  }

  /**
   * Checks if q is prime. And q divides p - 1.
   * @returns {void} Nothing.
   */
  validateQ () {
    if (!this.q.isProbablePrime()) throw new RangeError('q is not a prime.')
    if (!this.p.subtract(BigInteger.ONE).mod(this.q).equals(BigInteger.ZERO)) throw new RangeError('q does not divide p - 1.')
  }

  /**
   * Checks if g is element of Gq and g !== 1.
   * @param {BigInteger} g - Generator.
   * @returns {void} Nothing.
   */
  validateGenerator (g) {
    if (!this.includes(g)) throw new RangeError('g is not element of Gq.')
    if (g.equals(BigInteger.ONE)) throw new RangeError('g must not be one.')
  }

  /**
   * Validates p, q and g.
   * @returns {void} Nothing.
   */
  validate () {
    this.validateP()
    this.validateQ()
    this.validateGenerator(this.g)
  }
}

module.exports = Subgroup
