const IssuerParameters = require('../../src/IssuerParameters')
const L2048N256 = require('../../src/L2048N256')
const {UIDp, UIDh, g0, e, S} = require('./data')

const descGq = L2048N256.descGq
const generators = [
  // g0
  g0,
  // recommended generators
  ...L2048N256.generators
]

module.exports = new IssuerParameters(UIDp, descGq, UIDh, generators, e, S)
