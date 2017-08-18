const {BigInteger} = require('jsbn')

/**
 * Subgroup.
 * @typedef {Object} Subgroup.
 * @property {BigInteger} p - Field order.
 * @property {BigInteger} q - Prime order.
 * @property {BigInteger} g - Generator.
 */

/**
 * Creates a subgroup.
 * @param {string} p - Field order.
 * @param {string} q - Prime order.
 * @param {string} g - Generator.
 * @returns {Subgroup} Subgroup.
 */
exports.create = (p, q, g) => ({
  p: new BigInteger(p, 16),
  q: new BigInteger(q, 16),
  g: new BigInteger(g, 16)
})

/**
 * Checks if number is included in the group.
 * @param {Subgroup} group - Group.
 * @param {number} number - Number to check.
 * @returns {boolean} True if included, otherwise false.
 */
const includes = exports.includes = (group, number) => number.compareTo(group.p) < 0 && number.modPow(group.q, group.p).equals(BigInteger.ONE)

/**
 * Checks if p is prime.
 * @param {Subgroup} group - Group.
 * @returns {boolean} True if valid, otherwise false.
 */
const validateP = exports.validateP = (group) => group.p.isProbablePrime()

/**
 * Checks if q is prime. And q divides p - 1.
 * @param {Subgroup} group - Group.
 * @returns {boolean} True if valid, otherwise false.
 */
const validateQ = exports.validateQ = (group) => group.q.isProbablePrime() && group.p.subtract(BigInteger.ONE).mod(group.q).equals(BigInteger.ZERO)

/**
 * Checks if g is element of Gq and g !== 1.
 * @param {Subgroup} group - Group.
 * @returns {boolean} True if valid, otherwise false.
 */
const validateG = exports.validateG = (group) => includes(group, group.g) && !group.g.equals(BigInteger.ONE)

/**
 * Validates p, q and g.
 * @param {Subgroup} group - Group.
 * @returns {boolean} True if valid, otherwise false.
 */
exports.validate = (group) => validateP(group) && validateQ(group) && validateG(group)
