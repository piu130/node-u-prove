/**
 * Constructs a new token.
 */
class UProveToken {
  /**
   * Constructor.
   * @param {string} UIDp - Octet string holding an application-specific unique identifier for the issuer parameters, the value of which MUST be unique across the application realm.
   * @param {BigInteger} h - U-Prove tokens public key.
   * @param {string} TI - Token information field (e.g. expiry dates, token usage restrictions, and token metadata).
   * @param {string} PI - Prover information field.
   * @param {BigInteger} sigmaZPrime - Sigma z prime.
   * @param {BigInteger} sigmaCPrime - Sigma c prime.
   * @param {BigInteger} sigmaRPrime - Sigma r prime.
   * @param {boolean} [d=false] - Device protection flag.
   */
  constructor (UIDp, h, TI, PI, sigmaZPrime, sigmaCPrime, sigmaRPrime, d = false) {
    this.UIDp = UIDp
    this.h = h
    this.TI = TI
    this.PI = PI
    this.sigmaZPrime = sigmaZPrime
    this.sigmaCPrime = sigmaCPrime
    this.sigmaRPrime = sigmaRPrime
    this.d = d
  }
}

module.exports = UProveToken
