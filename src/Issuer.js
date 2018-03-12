const {
  computeXt,
  computeX,
  computeGamma,
  computeSigmaZ,
  computeSigmaA,
  computeSigmaB,
  computeSigmaR
} = require('functions')

/**
 * Constructs a new issuer.
 */
class Issuer {
  /**
   * Constructor.
   * @param {IssuerParameters} IP - Issuer parameters.
   * @param {Array<string>} attributes - Attributes.
   * @param {string} TI - Token information.
   */
  constructor (IP, attributes, TI) {
    this.IP = IP
    const xt = computeXt(this.IP, TI)
    const x = []
    for (let i = 0; i < attributes.length; i++) x.push(computeX(this.IP, this.IP.e[i], attributes[i]))
    this.gamma = computeGamma(this.IP, x, xt)
    // this.y0 = // generate at random from Zq
    this.sigmaZ = computeSigmaZ(this.IP.descGq, this.gamma, this.y0)
  }

  /**
   * Generates the first message.
   * @returns {{sigmaZ: *, sigmaA, sigmaB}} First message.
   */
  generateFirstMessage () {
    // this.w = // generate w at random from Zq
    const sigmaA = computeSigmaA(this.IP.descGq, this.w)
    const sigmaB = computeSigmaB(this.IP.descGq, this.gamma, this.w)
    return {
      sigmaZ: this.sigmaZ,
      sigmaA,
      sigmaB
    }
  }

  /**
   * Generates the third message.
   * @returns {{sigmaR}} Third message.
   */
  generateThirdMessage () {
    // Get sigma c from first message
    const sigmaR = computeSigmaR(this.IP, this.sigmaC, this.y0, this.w)
    delete this.w
    return {sigmaR}
  }
}

module.exports = Issuer
