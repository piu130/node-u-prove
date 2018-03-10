const {expect} = require('chai')
const {
  computeXt,
  computeTokenId
} = require('../src/functions')
const fxtIssuerParameters = require('./fixtures/issuerParameters')
const {TI} = require('./fixtures/data')
const fxtUProveToken = require('./fixtures/uProveToken')

describe('computeXt', function () {
  it('compute correct value', function () {
    expect(computeXt(fxtIssuerParameters, TI).toString(16))
      .to.equal('721c77bf383bb3402ab49794d285a7cbcfe96e6a593baf3c96ec1cd8f4eadd8d')
  })
})

describe('computeTokenId', function () {
  it('compute correct value', function () {
    expect(computeTokenId(fxtIssuerParameters.UIDh, fxtUProveToken))
      .to.equal('db17c922e458b4044cdc2a86295380badb6339f2f11d6a13aa561ba82f88d407')
  })
})
