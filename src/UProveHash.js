const crypto = require('crypto')
const {Buffer} = require('buffer')

/**
 * Constructs a new hash object.
 */
class UProveHash {
  /**
   * Constructor.
   * @param {string} algorithm - See crypto.createHash from NodeJS.
   */
  constructor (algorithm) {
    this._hash = crypto.createHash(algorithm)
    this._len4 = Buffer.allocUnsafe(4)
    this._len1 = this._len4.slice(0, 1)
  }

  /**
   * Updates a byte.
   * @param {number} byte - Byte.
   * @returns {void} Nothing.
   */
  updateByte (byte) {
    this._len1.writeUInt8(byte)
    this._hash.update(this._len1)
  }

  /**
   * Updates a number.
   * @param {number} number - Unsigned integer 32.
   * @returns {void} Nothing.
   */
  updateUInt32 (number) {
    this._len4.writeUInt32BE(number)
    this._hash.update(this._len4)
  }

  /**
   * Updates null.
   * @returns {void} Nothing.
   */
  updateNull () {
    this._len4.fill(0)
    this._hash.update(this._len4)
  }

  /**
   * Updates an octet string.
   * @param {string} octetString - Octet string.
   * @param {boolean} [raw=false] - If true the string is not formatted (meaning no length prepending).
   * @returns {void} Nothing.
   */
  updateOctetString (octetString, raw = false) {
    if (!Number.isInteger(octetString.length / 2)) octetString = '0' + octetString
    if (!raw) this.updateUInt32(octetString.length / 2)
    this._hash.update(Buffer.from(octetString, 'hex'))
  }

  /**
   * Updates a integer.
   * @param {BigInteger|number} number - Integer.
   * @returns {void} Nothing.
   */
  updateInteger (number) {
    this.updateOctetString(number.toString(16))
  }

  /**
   * Updates a subgroup construction.
   * @param {Subgroup} group - Subgroup construction.
   * @returns {void} Nothing.
   */
  updateSubgroup (group) {
    this.updateInteger(group.p)
    this.updateInteger(group.q)
    this.updateInteger(group.g)
  }

  // // todo
  // /**
  //  * Updates a elliptic curve construction.
  //  * @param {EllipticCurve} curve - Elliptic curve construction.
  //  * @returns {void} Nothing.
  //  */
  // updateECC (curve) {
  //   // throw new Error('updateECC not implemented yet')
  //   this.updateInteger(curve.p)
  //   this.updateInteger(curve.a)
  //   this.updateInteger(curve.b)
  //   this.updateInteger(curve.q)
  //   this.updateInteger(curve.g.x)
  //   this.updateInteger(curve.g.y)
  // }
  //
  // // todo
  // /**
  //  * Updates a elliptic curve point.
  //  * @param {BigInteger} point - Elliptic curve point.
  //  * @returns {void} Nothing.
  //  */
  // updatePoint (point) {
  //
  // }

  /**
   * Updates a list of booleans.
   * @param {Array<boolean>} list - List of booleans.
   * @returns {void} Nothing.
   */
  updateListOfBooleans (list) {
    this.updateUInt32(list.length)
    list.forEach(bool => this.updateByte(bool ? 1 : 0))
  }

  /**
   * Updates a list of bytes.
   * @param {Array<number>} list - List of bytes.
   * @returns {void} Nothing.
   */
  updateListOfBytes (list) {
    this.updateUInt32(list.length)
    list.forEach(this.updateByte, this)
  }

  /**
   * Updates a list of octet strings.
   * @param {Array<string>} list - List of octet strings.
   * @returns {void} Nothing.
   */
  updateListOfOctetStrings (list) {
    this.updateUInt32(list.length)
    list.forEach(this.updateOctetString, this)
  }

  /**
   * Updates a list of integers.
   * @param {Array<BigInteger|number>} list - List of integers.
   * @returns {void} Nothing.
   */
  updateListOfIntegers (list) {
    this.updateUInt32(list.length)
    list.forEach(this.updateInteger, this)
  }

  /**
   * Calculates digest.
   * @param {string} encoding - See hash.digest from NodeJS.
   * @returns {Buffer|string} Digest.
   */
  digest (encoding) {
    return this._hash.digest(encoding)
  }
}

UProveHash.defaultHash = 'sha256'

module.exports = UProveHash
