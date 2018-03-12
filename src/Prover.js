const {
  computeXt,
  computeX,
  computeGamma,
  computeH,
  computeT1,
  computeT2,
  computeAlphaInverse,
  computeSigmaZPrime,
  computeSigmaAPrime,
  computeSigmaBPrime,
  computeSigmaCPrime,
  computeSigmaC
} = require('./functions')

/**
 *
 */
class Prover {
  /**
   *
   * @param {IssuerParameters} IP - Issuer parameters.
   * @param {string} TI - Token information field. (eg. expiry dates, token usage restrictions, and token metadata.)
   * @param applicationAttributes - (eg. the time and date of the interaction, the actions taken by the Verifier upon accepting the U-Prove token, and the Prover's identifier in the Verifier's domain).
   */
  constructor (IP, {attributes, TI}) {
    this.IP = IP
    this.TI = TI
    const xt = computeXt(IP, TI)
    const x = []
    for (let i = 0; i < attributes.length; i++) x.push(computeX(IP, IP.e[i], attributes[i]))
    this.gamma = computeGamma(IP, x, xt)
  }

  /**
   * Generates the second message.
   * @returns {{sigmaC}} Second message.
   */
  generateSecondMessage () {
    // this.alpha = // generate at random from Zq*
    // this.beta1 = // generate at random from Zq
    // this.beta2 = // generate at random from Zq
    this.h = computeH(this.IP.descGq, this.gamma, this.alpha)
    this.t1 = computeT1(this.IP, this.beta1, this.beta2)
    this.t2 = computeT2(this.IP.descGq, this.h, this.beta2)
    this.alphaInverse = computeAlphaInverse(this.IP.descGq, this.alpha)

    // Get sigma z from first message
    this.sigmaZPrime = computeSigmaZPrime(this.IP.descGq, this.sigmaZ, this.alpha)
    // Get sigma a from first message
    this.sigmaAPrime = computeSigmaAPrime(this.IP.descGq, this.t1, this.sigmaA)
    // Get sigma b from first message
    this.sigmaBPrime = computeSigmaBPrime(this.IP.descGq, this.sigmaZPrime, this.beta1, this.t2, this.sigmaB, this.alpha)
    this.sigmaCPrime = computeSigmaCPrime(this.IP, this.h, this.PI, this.sigmaZPrime, this.sigmaAPrime, this.sigmaBPrime)
    const sigmaC = computeSigmaC(this.IP.descGq, this.sigmaCPrime, this.beta1)

    return {sigmaC}
  }
}

module.exports = Prover
