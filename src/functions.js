const {BigInteger} = require('jsbn')
const UProveHash = require('./UProveHash')

/**
 * Computes Xt.
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param {string} TI - Token information field.
 * @returns {BigInteger} Xt value.
 */
exports.computeXt = (IP, TI) => {
  const hash = new UProveHash(IP.UIDh)
  hash.updateByte(0x01)
  hash.updateOctetString(IP.hash)
  hash.updateOctetString(TI)
  return new BigInteger(hash.digest('hex'), 16).mod(IP.descGq.q)
}

/**
 * Computes X.
 * @param {BigInteger} q - Prime order q.
 * @param {string} [UIDh=UProveHash.defaultHash] - Hash type.
 * @param {boolean} e - Indicates if Ai should be hashed or not.
 * @param {string} A - Attribute.
 * @returns {BigInteger} X.
 */
exports.computeX = (q, UIDh = UProveHash.defaultHash, e, A) => {
  if (e) {
    if (A === '') return BigInteger.ZERO
    const hash = new UProveHash(UIDh)
    hash.updateOctetString(A)
    return new BigInteger(hash.digest('hex'), 16).mod(q)
  } else {
    return new BigInteger(A, 16).mod(q)
  }
}

/**
 * Computes token id.
 * @param {string} [UIDh=UProveHash.defaultHash] - Hash type.
 * @param {UProveToken} token - UProveToken.
 * @returns {string} Xi.
 */
exports.computeTokenId = (UIDh = UProveHash.defaultHash, token) => {
  const hash = new UProveHash(UIDh)
  hash.updateInteger(token.h)
  hash.updateInteger(token.sigmaZPrime)
  hash.updateInteger(token.sigmaCPrime)
  hash.updateInteger(token.sigmaRPrime)
  return hash.digest('hex')
}

/**
 *
 * @param {IssuerParameters} IP
 * @param {Array<BigInteger>} xs
 * @param {BigInteger} xt
 * @returns
 */
exports.computeGamma = (IP, xs, xt) => {
  const generators = IP.generators
  const p = IP.descGq.p
  let result = generators[0]
  for (let i = 0; i < xs.length; i++) {
    result = result.multiply(generators[i + 1].modPow(xs[i], p)).mod(p)
  }
  return result.multiply(generators[generators.length - 1].modPow(xt, p)).mod(p)
}

/**
 *
 * @param {BigInteger} gamma
 * @param {BigInteger} y0
 * @param {BigInteger} p
 * @returns
 */
exports.computeSigmaZ = (gamma, y0, p) => gamma.modPow(y0, p)

/**
 *
 * @param gamma
 * @param alpha
 * @param p
 * @returns
 */
exports.computeH = (gamma, alpha, p) => gamma.modPow(alpha, p)

/**
 *
 * @param sigmaZ
 * @param alpha
 * @param p
 * @returns
 */
exports.computeSigmaZPrime = (sigmaZ, alpha, p) => sigmaZ.modPow(alpha, p)

/**
 *
 * @param g0
 * @param g
 * @param beta1
 * @param beta2
 * @param p
 * @returns
 */
exports.computeT1 = (g0, g, beta1, beta2, p) => g0.modPow(beta1, p).multiply(g.modPow(beta2, p)).mod(p)

/**
 *
 * @param h
 * @param beta2
 * @param p
 * @returns
 */
exports.computeT2 = (h, beta2, p) => h.modPow(beta2, p)

/**
 *
 * @param sigmaZPrime
 * @param beta1
 * @param t2
 * @param sigmaB
 * @param alpha
 * @param p
 * @param q
 * @returns
 */
exports.computeSigmaBPrime = (sigmaZPrime, beta1, t2, sigmaB, alpha, p, q) =>
  sigmaZPrime.modPow(beta1, p)
    .multiply(t2)
    .multiply(sigmaB.modPow(alpha, p)).mod(p)

/**
 *
 * @param alpha
 * @param q
 * @returns
 */
exports.computeAlphaInverse = (alpha, q) => alpha.modInverse(q)

/**
 *
 * @param t1
 * @param sigmaA
 * @param q
 * @returns
 */
exports.computeSigmaAPrime = (t1, sigmaA, q) => t1.multiply(sigmaA).mod(q)

/**
 * Computes sigma c prime.
 * @param {string} UIDh
 * @param {BigInteger} h
 * @param {string} PI
 * @param {BigInteger} sigmaZPrime
 * @param {BigInteger} sigmaAPrime
 * @param {BigInteger} sigmaBPrime
 * @param {BigInteger} q
 * @returns
 */
exports.computeSigmaCPrime = (UIDh, h, PI, sigmaZPrime, sigmaAPrime, sigmaBPrime, q) => {
  const hash = new UProveHash(UIDh)
  hash.updateInteger(h)
  hash.updateOctetString(PI)
  hash.updateInteger(sigmaZPrime)
  hash.updateInteger(sigmaAPrime)
  hash.updateInteger(sigmaBPrime)
  return new BigInteger(hash.digest('hex'), 16).mod(q)
}

/**
 *
 * @param g
 * @param w
 * @param p
 * @returns
 */
exports.computeSigmaA = (g, w, p) => g.modPow(w, p)

/**
 *
 * @param gamma
 * @param w
 * @param p
 * @returns
 */
exports.computeSigmaB = (gamma, w, p) => gamma.modPow(w, p)

/**
 * Computes sigma c.
 * @param {BigInteger} sigmaCPrime - Sigma c prime.
 * @param {BigInteger} beta1 - Beta 1.
 * @param {BigInteger} q - Q.
 * @returns {BigInteger} Sigma c.
 */
exports.computeSigmaC = (sigmaCPrime, beta1, q) => sigmaCPrime.add(beta1).mod(q)

/**
 * Computes sigma r.
 * @param {BigInteger} sigmaC - Sigma c.
 * @param {BigInteger} y0 - Y0.
 * @param {BigInteger} w - W.
 * @param {BigInteger} q - Q.
 * @returns {BigInteger} Sigma r.
 */
exports.computeSigmaR = (sigmaC, y0, w, q) => sigmaC.multiply(y0).add(w).mod(q)

/**
 *
 * @param {BigInteger} sigmaR
 * @param {BigInteger} beta2
 * @param {BigInteger} q
 * @returns  {BigInteger} sigma r prime.
 */
exports.computeSigmaRPrime = (sigmaR, beta2, q) => sigmaR.add(beta2).mod(q)
