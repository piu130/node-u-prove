const crypto = require('crypto')

/**
 * Constructs a new hash object.
 */
class UProveHash {
  /**
   * Constructor.
   * @param {string} [algorithm=UProveHash.defaultHash] - See crypto.createHash from NodeJS.
   */
  constructor (algorithm = UProveHash.defaultHash) {
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
    this.updateUInt32(0)
  }

  /**
   * Updates an octet string.
   * @param {string} octetString - Octet string.
   * @returns {void} Nothing.
   */
  updateOctetString (octetString) {
    this.updateUInt32(Math.ceil(octetString.length / 2))
    this._hash.update(Buffer.from(octetString, 'hex'))
  }

  /**
   * Updates a big integer.
   * @param {BigInteger} number - Big integer.
   * @returns {void} Nothing.
   */
  updateBigInteger (number) {
    this.updateOctetString(number.toString(16))
  }

  /**
   * Updates a subgroup construction.
   * @param {Subgroup} group - Subgroup construction.
   * @returns {void} Nothing.
   */
  updateSubgroup (group) {
    this.updateBigInteger(group.p)
    this.updateBigInteger(group.q)
    this.updateBigInteger(group.g)
  }

  // // @todo
  // updateECC (group) {
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
   * Updates a list of big integers.
   * @param {Array<BigInteger>} list - List of big integers.
   * @returns {void} Nothing.
   */
  updateListOfBigIntegers (list) {
    this.updateUInt32(list.length)
    list.forEach(this.updateBigInteger, this)
  }

  /**
   * Calculates the digest.
   * @param {string} encoding - See hash.digest from NodeJS.
   * @returns {Buffer|string} Digest.
   */
  digest (encoding) {
    return this._hash.digest(encoding)
  }
}

UProveHash.defaultHash = 'sha256'

module.exports = UProveHash
