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
 * Computes Xi.
 * @param {BigInteger} q - Prime order q.
 * @param {string} [UIDh=UProveHash.defaultHash] - Hash type.
 * @param {boolean} ei - Indicates if Ai should be hashed or not.
 * @param {string} Ai - Attribute.
 * @returns {BigInteger} Xi.
 */
exports.computeXi = (q, UIDh = UProveHash.defaultHash, ei, Ai) => {
  if (ei) {
    if (Ai === '') return BigInteger.ZERO
    const hash = new UProveHash(UIDh)
    hash.updateOctetString(Ai)
    return new BigInteger(hash, 16).mod(q)
  } else {
    const intAi = new BigInteger(Ai, 16)
    if (intAi.compareTo(BigInteger.ZERO) < 0 || intAi.compareTo(q) > 0) throw new Error('Ai is smaller than 0 or greater than q.')
    return intAi
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
