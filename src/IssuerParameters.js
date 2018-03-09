const UProveHash = require('./UProveHash')

/**
 * Constructs a new IssuerParameters object.
 */
class IssuerParameters {
  /**
   * Constructor.
   * @param {string} UIDp - Octet string holding an application-specific unique identifier for the issuer parameters, the value of which MUST be unique across the application realm.
   * @param {Subgroup} descGq - Description of group q.
   * @param {string|undefined} [UIDh=UProveHash.defaultHash] - Hash function to use. See NodeJS crypto module for supported hashes. Pass undefined to use default value.
   * @param {Array<BigInteger>} generators - Generators to use in the form (g0, [g1, ..., gn,] gt[, gd]).
   * @param {Array<boolean>} e - List with length n, indicating whether or not the attribute values are hashed when computing a U-Prove token public key h.
   * @param {string} S - Octet string application-specific specification for the issuer parameters and the U-Prove tokens issued using them.
   * @param {boolean} [d=false] - Device protection flag. Pass generator in generators.
   */
  constructor (UIDp, descGq, UIDh = UProveHash.defaultHash, generators, e, S, d = false) {
    this.UIDp = UIDp
    this.descGq = descGq
    descGq.validate()
    this.UIDh = UIDh
    this.generators = generators
    this.validateGenerators()
    this.e = e
    this.S = S
    this.d = d
  }

  /**
   * Returns the hash as a buffer.
   * @returns {string} Hash as hex string.
   */
  get hash () {
    if (!this.P) this.P = this.computeHash('hex')
    return this.P
  }

  /**
   * Returns the hash of the issuer parameters with the given encoding.
   * @param {string} [encoding] - See hash.digest from NodeJS.
   * @returns {Buffer|string} Digest.
   */
  computeHash (encoding) {
    const hash = new UProveHash(this.UIDh)
    hash.updateOctetString(this.UIDp)
    hash.updateSubgroup(this.descGq)
    // TODO add device generator?
    hash.updateListOfIntegers([
      ...this.generators.slice(0, this.e.length + 1),
      this.generators[this.generators.length - (this.d ? 2 : 1)]
    ])
    hash.updateListOfBooleans(this.e)
    hash.updateOctetString(this.S)
    return hash.digest(encoding)
  }

  /**
   * Validates generators.
   * @returns {void} Nothing.
   */
  validateGenerators () {
    this.generators.forEach(this.descGq.validateGenerator, this.descGq)
  }
}

module.exports = IssuerParameters
