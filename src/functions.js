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
 * @param IP
 * @param {Array<BigInteger>} xis
 * @param {BigInteger} xt
 */
exports.computeGamma = (IP, xis, xt) => {
  const generators = IP.generators
  const q = IP.descGq.q
  let i = 1
  return xis.reduce(
    (acc, curr) => {
      console.log(curr.toString(16))
      console.log(generators[i].toString(16))
      console.log('-----')
      return acc.multiply(generators[i++].modPow(curr, q))
    }
    , generators[0]
  ).multiply(generators[generators.length - 1].modPow(xt, q)).toString(16)
}

/**
 *
 * @param {BigInteger} gamma
 * @param {BigInteger} y0
 * @param {BigInteger} q
 */
exports.computeSigmaZ = (gamma, y0, q) => gamma.modPow(y0, q)

/**
 * Computes sigma c prime.
 * @param {string} UIDh
 * @param {BigInteger} h
 * @param {string} PI
 * @param {BigInteger} sigmaZPrime
 * @param {BigInteger} sigmaAPrime
 * @param {BigInteger} sigmaBPrime
 * @param {BigInteger} q
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
