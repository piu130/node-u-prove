const {BigInteger} = require('jsbn')
const UProveHash = require('./UProveHash')

/**
 * Computes Xt.
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param {string} TI - Token information field.
 * @returns {BigInteger} Xt value.
 */
exports.computeXt = ({UIDh, hash, descGq}, TI) => {
  const uHash = new UProveHash(UIDh)
  uHash.updateByte(0x01)
  uHash.updateOctetString(hash)
  uHash.updateOctetString(TI)
  return descGq.Gq.mod(new BigInteger(uHash.digest('hex'), 16))
}

/**
 * Computes X.
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param {boolean} e - Indicates if Ai should be hashed or not.
 * @param {string} A - Attribute.
 * @returns {BigInteger} X.
 */
exports.computeX = ({descGq, UIDh}, e, A) => {
  if (e) {
    if (A === '') return BigInteger.ZERO
    const hash = new UProveHash(UIDh)
    hash.updateOctetString(A)
    return descGq.Gq.mod(new BigInteger(hash.digest('hex'), 16))
  } else {
    return descGq.Gq.mod(new BigInteger(A, 16))
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
 * @returns {BigInteger} Gamma.
 */
exports.computeGamma = ({generators, descGq}, xs, xt) => {
  const Gq = descGq.Gq
  let result = generators[0]
  for (let i = 0; i < xs.length; i++) {
    result = Gq.multiply(result, Gq.modPow(generators[i + 1], xs[i]))
  }
  return Gq.multiply(result, Gq.modPow(generators[generators.length - 1], xt))
}

/**
 *
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} gamma
 * @param {BigInteger} y0
 * @returns
 */
exports.computeSigmaZ = ({Gq}, gamma, y0) => Gq.modPow(gamma, y0)

/**
 *
 * @param {Subgroup} descGq - Prime order q.
 * @param gamma
 * @param alpha
 * @returns
 */
exports.computeH = ({Gq}, gamma, alpha) => Gq.modPow(gamma, alpha)

/**
 *
 * @param {Subgroup} descGq - Prime order q.
 * @param sigmaZ
 * @param alpha
 * @returns
 */
exports.computeSigmaZPrime = ({Gq}, sigmaZ, alpha) => Gq.modPow(sigmaZ, alpha)

/**
 *
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param g
 * @param beta1
 * @param beta2
 * @param {Subgroup} descGq - Prime order q.
 * @returns
 */
exports.computeT1 = ({generators, descGq}, beta1, beta2) => descGq.Gq.multiply(descGq.Gq.modPow(generators[0], beta1), descGq.Gq.modPow(descGq.g, beta2))

/**
 *
 * @param {Subgroup} descGq - Prime order q.
 * @param h
 * @param beta2
 * @returns
 */
exports.computeT2 = ({Gq}, h, beta2) => Gq.modPow(h, beta2)

/**
 *
 * @param {Subgroup} descGq - Prime order q.
 * @param sigmaZPrime
 * @param beta1
 * @param t2
 * @param sigmaB
 * @param alpha
 * @returns
 */
exports.computeSigmaBPrime = ({Gq}, sigmaZPrime, beta1, t2, sigmaB, alpha) =>
  Gq.multiply(
    Gq.multiply(Gq.modPow(sigmaZPrime, beta1), t2),
    Gq.modPow(sigmaB, alpha)
  )

/**
 *
 * @param {Subgroup} descGq - Prime order q.
 * @param alpha
 * @returns
 */
exports.computeAlphaInverse = ({Zq}, alpha) => Zq.modInverse(alpha)

/**
 *
 * @param t1
 * @param sigmaA
 * @param {Subgroup} descGq - Prime order q.
 * @returns
 */
exports.computeSigmaAPrime = ({Gq}, t1, sigmaA) => Gq.multiply(t1, sigmaA)

/**
 * Computes sigma c prime.
 * @param {string} UIDh
 * @param {BigInteger} h
 * @param {string} PI
 * @param {BigInteger} sigmaZPrime
 * @param {BigInteger} sigmaAPrime
 * @param {BigInteger} sigmaBPrime
 * @param {Subgroup} descGq - Prime order q.
 * @returns
 */
exports.computeSigmaCPrime = ({UIDh, descGq}, h, PI, sigmaZPrime, sigmaAPrime, sigmaBPrime) => {
  const hash = new UProveHash(UIDh)
  hash.updateInteger(h)
  hash.updateOctetString(PI)
  hash.updateInteger(sigmaZPrime)
  hash.updateInteger(sigmaAPrime)
  hash.updateInteger(sigmaBPrime)
  return descGq.Zq.mod(new BigInteger(hash.digest('hex'), 16))
}

/**
 *
 * @param {Subgroup} descGq - Prime order q.
 * @param w
 * @param {Subgroup} descGq - Prime order q.
 * @returns
 */
exports.computeSigmaA = ({Gq, g}, w) => Gq.modPow(g, w)

/**
 *
 * @param {Subgroup} descGq - Prime order q.
 * @param gamma
 * @param w
 * @returns
 */
exports.computeSigmaB = ({Gq}, gamma, w) => Gq.modPow(gamma, w)

/**
 * Computes sigma c.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} sigmaCPrime - Sigma c prime.
 * @param {BigInteger} beta1 - Beta 1.
 * @returns {BigInteger} Sigma c.
 */
exports.computeSigmaC = ({Zq}, sigmaCPrime, beta1) => Zq.add(sigmaCPrime, beta1)

/**
 * Computes sigma r.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} sigmaC - Sigma c.
 * @param {BigInteger} y0 - Y0.
 * @param {BigInteger} w - W.
 * @returns {BigInteger} Sigma r.
 */
exports.computeSigmaR = ({Zq}, sigmaC, y0, w) => Zq.add(Zq.multiply(sigmaC, y0), w)

/**
 *
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} sigmaR
 * @param {BigInteger} beta2
 * @returns  {BigInteger} sigma r prime.
 */
exports.computeSigmaRPrime = ({Zq}, sigmaR, beta2) => Zq.add(sigmaR, beta2)

/**
 *
 * @param {IssuerParameters} IP
 * @param {UProveToken} token
 */
exports.verifyTokenSignature = ({UIDh, descGq, generators}, {h, PI, sigmaZPrime, sigmaRPrime, sigmaCPrime}) => {
  if (h.equals(BigInteger.ONE)) return false
  const {Zq, Gq} = descGq
  const hash = new UProveHash(UIDh)
  hash.updateInteger(h)
  hash.updateOctetString(PI)
  hash.updateInteger(sigmaZPrime)
  // g^sigmaRPrime * g0^(-sigmaCPrime)
  hash.updateInteger(Gq.multiply(Gq.modPow(descGq.g, sigmaRPrime), Gq.modInverse(Gq.modPow(generators[0], sigmaCPrime))))
  // h^sigmaRPrime * sigmaZPrime^(-sigmaCPrime)
  hash.updateInteger(Gq.multiply(Gq.modPow(h, sigmaRPrime), Gq.modInverse(Gq.modPow(sigmaZPrime, sigmaCPrime))))
  return Zq.mod(new BigInteger(hash.digest('hex'), 16)).equals(sigmaCPrime)
}
