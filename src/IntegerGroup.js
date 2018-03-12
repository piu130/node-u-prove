/**
 *
 */
class IntegerGroup {
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
}

module.exports = IntegerGroup
