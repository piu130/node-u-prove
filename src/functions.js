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
 * Computes gamma.
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param {Array<BigInteger>} xs - Encoded / hashed attributes.
 * @param {BigInteger} xt - Xt.
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
 * Computes sigma z.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} gamma - Gamma.
 * @param {BigInteger} y0 - Y0.
 * @returns {BigInteger} Sigma z.
 */
exports.computeSigmaZ = ({Gq}, gamma, y0) => Gq.modPow(gamma, y0)

/**
 * Computes h.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} gamma - Gamma.
 * @param {BigInteger} alpha - Alpha.
 * @returns {BigInteger} H.
 */
exports.computeH = ({Gq}, gamma, alpha) => Gq.modPow(gamma, alpha)

/**
 * Computes sigma z prime.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} sigmaZ - Sigma z.
 * @param {BigInteger} alpha - Alpha.
 * @returns {BigInteger} Sigma z prime.
 */
exports.computeSigmaZPrime = ({Gq}, sigmaZ, alpha) => Gq.modPow(sigmaZ, alpha)

/**
 * Computes t1.
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param {BigInteger} beta1 - Beta1.
 * @param {BigInteger} beta2 - Beta2.
 * @returns {BigInteger} T1.
 */
exports.computeT1 = ({generators, descGq}, beta1, beta2) => descGq.Gq.multiply(descGq.Gq.modPow(generators[0], beta1), descGq.Gq.modPow(descGq.g, beta2))

/**
 * Computes t2.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} h - H.
 * @param {BigInteger} beta2 - Beta2.
 * @returns {BigInteger} T2.
 */
exports.computeT2 = ({Gq}, h, beta2) => Gq.modPow(h, beta2)

/**
 * Computes sigma b prime.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} sigmaZPrime - Sigma z prime.
 * @param {BigInteger} beta1 - Beta1.
 * @param {BigInteger} t2 - T2.
 * @param {BigInteger} sigmaB - Sigma b.
 * @param {BigInteger} alpha - Alpha.
 * @returns {BigInteger} Sigma b prime.
 */
exports.computeSigmaBPrime = ({Gq}, sigmaZPrime, beta1, t2, sigmaB, alpha) =>
  Gq.multiply(
    Gq.multiply(Gq.modPow(sigmaZPrime, beta1), t2),
    Gq.modPow(sigmaB, alpha)
  )

/**
 * Computes alpha inverse.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} alpha - Alpha.
 * @returns {BigInteger} Alpha inverse.
 */
exports.computeAlphaInverse = ({Zq}, alpha) => Zq.modInverse(alpha)

/**
 * Computes sigma a prime.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} t1 - T1.
 * @param {BigInteger} sigmaA - Sigma a.
 * @returns {BigInteger} Sigma a prime.
 */
exports.computeSigmaAPrime = ({Gq}, t1, sigmaA) => Gq.multiply(t1, sigmaA)

/**
 * Computes sigma c prime.
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param {BigInteger} h - H.
 * @param {string} PI - Prover information field.
 * @param {BigInteger} sigmaZPrime - Sigma z prime.
 * @param {BigInteger} sigmaAPrime - Sigma a prime.
 * @param {BigInteger} sigmaBPrime - Sigma b prime.
 * @returns {BigInteger} Sigma c prime.
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
 * Computes sigma a.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} w - W.
 * @returns {BigInteger} Sigma a.
 */
exports.computeSigmaA = ({Gq, g}, w) => Gq.modPow(g, w)

/**
 * Computes sigma b.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} gamma - Gamma.
 * @param {BigInteger} w - W.
 * @returns {BigInteger} Sigma b.
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
 * Computes sigma r prime.
 * @param {Subgroup} descGq - Prime order q.
 * @param {BigInteger} sigmaR - Sigma r.
 * @param {BigInteger} beta2 - Beta2.
 * @returns {BigInteger} Sigma r prime.
 */
exports.computeSigmaRPrime = ({Zq}, sigmaR, beta2) => Zq.add(sigmaR, beta2)

/**
 * Verifies the token signature.
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param {UProveToken} token - Token.
 * @returns {boolean} True if signature ok, otherwise false.
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

// todo better name for this function?
/**
 * Verifies sigmaAPrime*sigmaBPrime=(g*h)^sigmaRPrime * (g0*sigmaZPrime)^-sigmaCPrime.
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param {BigInteger} sigmaAPrime - Sigma a prime.
 * @param {BigInteger} sigmaBPrime - Sigma b prime.
 * @param {BigInteger} h - H.
 * @param {BigInteger} sigmaRPrime - Sigma r prime.
 * @param {BigInteger} sigmaZPrime - Sigma z prime.
 * @param {BigInteger} sigmaCPrime - Sigma c prime.
 * @returns {boolean} True if ok. Otherwise false.
 */
exports.verifySigmaABPrime = ({descGq, generators}, sigmaAPrime, sigmaBPrime, h, sigmaRPrime, sigmaZPrime, sigmaCPrime) => {
  const {Gq} = descGq
  const right = Gq.multiply(
    Gq.modPow(Gq.multiply(descGq.g, h), sigmaRPrime),
    Gq.modInverse(Gq.modPow(Gq.multiply(generators[0], sigmaZPrime), sigmaCPrime))
  )
  const left = Gq.multiply(sigmaAPrime, sigmaBPrime)
  return left.equals(right)
}

/**
 * Computes a verifiably random element.
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param {string} context - Context.
 * @param {number} index - Index.
 * @returns {BigInteger} Verifiably random element.
 */
exports.computeVerifiablyRandomElementSubgroup = ({UIDh, descGq}, context, index) => {
  const {p, q} = descGq
  const e = p.subtract(BigInteger.ONE).divide(q)
  const TWO = new BigInteger('2')
  let count = 0
  let g = BigInteger.ZERO
  while (g.compareTo(TWO) < 0) {
    if (count++ >= 255) throw new Error('Count is not smaller than 255')
    const hash = new UProveHash(UIDh)
    hash.updateOctetString(context + '6767656E', true)
    hash.updateByte(index)
    hash.updateByte(count)
    const w = new BigInteger(hash.digest('hex'), 16)
    g = w.modPow(e, p)
  }
  return g
}

// /**
//  *
//  * @param {IssuerParameters} IP
//  * @param {string} s
//  */
// exports.generteScopeElement = ({UIDh, descGq}, s) => {
//
// }
