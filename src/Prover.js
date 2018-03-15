const Token = require('./UProveToken')
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
  computeSigmaC,
  computeSigmaRPrime,
  verifySigmaABPrime
} = require('./functions')

/**
 * Constructs a new prover.
 */
class Prover {
  /**
   * Constructor.
   * @param {IssuerParameters} IP - Issuer parameters.
   * @param {Array<string>} attributes - Application specific attributes (e.g. the time and date of the interaction, the actions taken by the Verifier upon accepting the U-Prove token, and the Prover's identifier in the Verifier's domain).
   * @param {string} TI - Token information field (e.g. expiry dates, token usage restrictions, and token metadata).
   * @param {string} PI - Prover information field (e.g. contact information, an encryption key, or a Verifier-supplied nonce to guarantee freshness of the U-Prove token)
   */
  constructor (IP, attributes, TI, PI) {
    this.IP = IP
    this.TI = TI
    this.PI = PI
    const xt = computeXt(this.IP, TI)
    const x = []
    for (let i = 0; i < attributes.length; i++) x.push(computeX(this.IP, this.IP.e[i], attributes[i]))
    this.gamma = computeGamma(this.IP, x, xt)
  }

  /**
   * Parses the first message.
   * @param {{sigmaZ, sigmaA, sigmaB}} firstMessage - First message.
   * @returns {void} Nothing.
   */
  parseFirstMessage ({sigmaZ, sigmaA, sigmaB}) {
    this.sigmaZ = sigmaZ
    this.sigmaA = sigmaA
    this.sigmaB = sigmaB
  }

  /**
   * Generates the second message.
   * @returns {{sigmaC}} Second message.
   */
  generateSecondMessage () {
    this.alpha = this.IP.descGq.Zq.randomNumber(false)
    this.beta1 = this.IP.descGq.Zq.randomNumber()
    this.beta2 = this.IP.descGq.Zq.randomNumber()
    this.h = computeH(this.IP.descGq, this.gamma, this.alpha)
    this.t1 = computeT1(this.IP, this.beta1, this.beta2)
    this.t2 = computeT2(this.IP.descGq, this.h, this.beta2)
    this.alphaInverse = computeAlphaInverse(this.IP.descGq, this.alpha)

    this.sigmaZPrime = computeSigmaZPrime(this.IP.descGq, this.sigmaZ, this.alpha)
    this.sigmaAPrime = computeSigmaAPrime(this.IP.descGq, this.t1, this.sigmaA)
    this.sigmaBPrime = computeSigmaBPrime(this.IP.descGq, this.sigmaZPrime, this.beta1, this.t2, this.sigmaB, this.alpha)
    this.sigmaCPrime = computeSigmaCPrime(this.IP, this.h, this.PI, this.sigmaZPrime, this.sigmaAPrime, this.sigmaBPrime)
    const sigmaC = computeSigmaC(this.IP.descGq, this.sigmaCPrime, this.beta1)

    return {sigmaC}
  }

  /**
   * Parses third message.
   * @param {{sigmaR: BigInteger}} thirdMessage - Third message.
   * @returns {void} Nothing.
   */
  parseThirdMessage ({sigmaR}) {
    this.sigmaR = sigmaR
  }

  /**
   * Generates the token.
   * @returns {UProveToken} Token.
   */
  generateUProveToken () {
    const sigmaRPrime = computeSigmaRPrime(this.IP.descGq, this.sigmaR, this.beta2)
    if (
      !verifySigmaABPrime(this.IP, this.sigmaAPrime, this.sigmaBPrime, this.h, sigmaRPrime, this.sigmaZPrime, this.sigmaCPrime)
    ) throw new Error('Cannot verify sigma r prime')
    // todo delete this.beta0???
    delete this.beta1
    delete this.beta2
    delete this.t1
    delete this.t2
    return new Token(this.IP.UIDp, this.h, this.TI, this.PI, this.sigmaZPrime, this.sigmaCPrime, sigmaRPrime, this.IP.d)
  }
}

module.exports = Prover
