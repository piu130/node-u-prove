const {BigInteger} = require('jsbn')
const UProveHash = require('./UProveHash')

/**
 * Computes Xt.
 * @param {IssuerParameters} IP - Issuer parameters.
 * @param {string} TI - Token information field.
 * @returns {BigInteger} Xt value.
 */
module.exports = (IP, TI) => {
  const hash = new UProveHash(IP.UIDh)
  hash.updateByte(0x01)
  hash.updateOctetString(IP.hash)
  hash.updateOctetString(TI)
  return new BigInteger(hash.digest('hex'), 16).mod(IP.descGq.q)
}
