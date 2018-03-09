const UProveHash = require('./UProveHash')

/**
 * Computes token id.
 * @param {string} [UIDh=UProveHash.defaultHash] - Hash type.
 * @param {UProveToken} token - UProveToken.
 * @returns {string} Xi.
 */
module.exports = (UIDh = UProveHash.defaultHash, token) => {
  const hash = new UProveHash(UIDh)
  hash.updateInteger(token.h)
  hash.updateInteger(token.sigmaZPrime)
  hash.updateInteger(token.sigmaCPrime)
  hash.updateInteger(token.sigmaRPrime)
  return hash.digest('hex')
}
