const UProveToken = require('../../src/UProveToken')
const {UIDp, h, TI, PI, sigmaZPrime, sigmaCPrime, sigmaRPrime} = require('./data')

module.exports = new UProveToken(UIDp, h, TI, PI, sigmaZPrime, sigmaCPrime, sigmaRPrime)
