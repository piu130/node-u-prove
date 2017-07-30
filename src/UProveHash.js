const crypto = require('crypto')

/**
 * Constructs a new hash object.
 */
class UProveHash {
  /**
   * Constructor.
   * @param {string} [algorithm='sha256'] - See crypto.createHash from NodeJS.
   */
  constructor (algorithm = 'sha256') {
    this._algorithm = algorithm
    this._size = 0
    // set first element to 0 for reduce logic
    this._steps = [0]
  }

  /**
   * Updates a byte.
   * @param {number} byte - Byte to update.
   * @returns {void} Nothing.
   */
  updateByte (byte) {
    this._size += 1
    this._steps.push((buff, offset) => buff.writeUInt8(byte, offset))
  }

  /**
   * Updates a number.
   * @param {number} number - Unsigned integer 32 to update.
   * @returns {void} Nothing.
   */
  updateUInt32 (number) {
    this._size += 4
    this._steps.push((buff, offset) => buff.writeUInt32BE(number, offset))
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
   * @param {string} octetString - Octet string to update.
   * @returns {void} Nothing.
   */
  updateOctetString (octetString) {
    const length = Math.ceil(octetString.length / 2)
    this._size += length
    this.updateUInt32(length)
    this._steps.push((buff, offset) => buff.write(octetString, offset, length, 'hex') + offset)
  }

  /**
   * Updates a subgroup construction.
   * @param {Object} group - Subgroup construction.
   * @param {string} group.p - Field order.
   * @param {string} group.q - Prime order.
   * @param {string} group.g - Generator.
   * @returns {void} Nothing.
   */
  updateSubGroup (group) {
    this.updateOctetString(group.p)
    this.updateOctetString(group.q)
    this.updateOctetString(group.g)
  }

  // @todo
  // updateECC (group) {
  //
  // }

  /**
   * Updates a list of booleans.
   * @param {Array<boolean>} list - List of booleans to update.
   * @returns {void} Nothing.
   */
  updateListOfBooleans (list) {
    this.updateUInt32(list.length)
    list.forEach(bool => this.updateByte(bool ? 1 : 0))
  }

  /**
   * Updates a list of bytes.
   * @param {Array<number>} list - List of bytes to update.
   * @returns {void} Nothing.
   */
  updateListOfBytes (list) {
    this.updateUInt32(list.length)
    list.forEach(this.updateByte, this)
  }

  /**
   * Updates a list of octet strings.
   * @param {Array<string>} list - List of octet strings to update.
   * @returns {void} Nothing.
   */
  updateListOfOctetStrings (list) {
    this.updateUInt32(list.length)
    list.forEach(this.updateOctetString, this)
  }

  /**
   * Creates the buffer to hash.
   * @returns {Buffer} Buffer to hash.
   * @private
   */
  _createBuffer () {
    const buff = Buffer.allocUnsafe(this._size)
    this._steps.reduce((accumulator, func) => func(buff, accumulator))
    return buff
  }

  /**
   * Calculates the digest.
   * @param {string} encoding - See hash.digest from NodeJS.
   * @returns {Buffer|string} Digest.
   */
  digest (encoding) {
    const hash = crypto.createHash(this._algorithm)
    hash.update(this._createBuffer())
    return hash.digest(encoding)
  }
}

module.exports = UProveHash
