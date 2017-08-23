const {BigInteger} = require('jsbn')
const IssuerParameters = require('../../src/IssuerParameters')
const L2048N256 = require('../../src/L2048N256')
const {UIDp, UIDh, g0, e, S} = require('./data')

const descGq = L2048N256.descGq
const generators = [
  // g0
  new BigInteger(g0, 16),
  // recommended generators
  ...L2048N256.generators
]

module.exports = new IssuerParameters(UIDp, descGq, UIDh, generators, e, S)
