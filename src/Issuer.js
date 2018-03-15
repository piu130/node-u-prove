const {
  computeXt,
  computeX,
  computeGamma,
  computeSigmaZ,
  computeSigmaA,
  computeSigmaB,
  computeSigmaR
} = require('./functions')

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
    this.y0 = this.IP.descGq.Zq.randomNumber()
    this.sigmaZ = computeSigmaZ(this.IP, this.gamma, this.y0)
  }

  /**
   * Generates the first message.
   * @returns {{
   *  sigmaZ: BigInteger,
   *  sigmaA: BigInteger,
   *  sigmaB: BigInteger
   * }} First message.
   */
  generateFirstMessage () {
    this.w = this.IP.descGq.Zq.randomNumber()
    const sigmaA = computeSigmaA(this.IP, this.w)
    const sigmaB = computeSigmaB(this.IP, this.gamma, this.w)
    return {
      sigmaZ: this.sigmaZ,
      sigmaA,
      sigmaB
    }
  }

  /**
   * Parses the second message.
   * @param {{sigmaC: BigInteger}} secondMessage - Second message.
   * @returns {void} Nothing.
   */
  parseSecondMessage ({sigmaC}) {
    this.sigmaC = sigmaC
  }

  /**
   * Generates the third message.
   * @returns {{sigmaR}} Third message.
   */
  generateThirdMessage () {
    const sigmaR = computeSigmaR(this.IP, this.sigmaC, this.y0, this.w)
    delete this.w
    return {sigmaR}
  }
}

module.exports = Issuer
