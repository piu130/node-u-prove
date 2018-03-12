const {randomBytes} = require('crypto')
const {BigInteger} = require('jsbn')

/**
 * Constructs a new integer group.
 */
class IntegerGroup {
  /**
   * Constructor.
   * @param {BigInteger} modulus - Modulus.
   */
  constructor (modulus) {
    this.modulus = modulus
  }

  /**
   * Returns the converted element for this group.
   * @param {BigInteger} bigInteger - Number to convert to this group.
   * @returns {BigInteger} Result.
   */
  createFromBigInteger (bigInteger) {
    return bigInteger.mod(this.modulus)
  }

  /**
   * Calculates number%modulus.
   * @param {BigInteger} number - Number.
   * @returns {BigInteger} Result.
   */
  mod (number) {
    return number.mod(this.modulus)
  }

  /**
   * Calculates a+b.
   * @param {BigInteger} a - Summand.
   * @param {BigInteger} b - Summand.
   * @returns {BigInteger} Result.
   */
  add (a, b) {
    return a.add(b).mod(this.modulus)
  }

  /**
   * Calculates a*b.
   * @param {BigInteger} a - Multiplier.
   * @param {BigInteger} b - Multiplier.
   * @returns {BigInteger} Result.
   */
  multiply (a, b) {
    return a.multiply(b).mod(this.modulus)
  }

  /**
   * Calculates (a^b) % m.
   * @param {BigInteger} a - Base.
   * @param {BigInteger} b - Exponent.
   * @returns {BigInteger} Result.
   */
  modPow (a, b) {
    return a.modPow(b, this.modulus)
  }

  /**
   * Calculates number^-1.
   * @param {BigInteger} number - Number.
   * @returns {BigInteger} Result.
   */
  modInverse (number) {
    return number.modInverse(this.modulus)
  }

  /**
   * Returns a random number of this group.
   * @param {boolean} [includeZero=true] - True if random number could be zero. Otherwise false.
   * @returns {BigInteger} Random number in this group.
   */
  randomNumber (includeZero = true) {
    const byteLength = Math.ceil(this.modulus.bitLength() / 4)
    const randomNum = new BigInteger(randomBytes(byteLength).toString('hex')).mod(this.modulus) // todo is this secure to generate a random number?
    return includeZero || !randomNum.equals(BigInteger.ZERO) ? randomNum : this.randomNumber(includeZero)
  }
}

module.exports = IntegerGroup
