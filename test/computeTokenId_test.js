const {expect} = require('chai')
const computeTokenId = require('../src/computeTokenId')
const fxtIssuerParameters = require('./fixtures/issuerParameters')
const fxtUProveToken = require('./fixtures/uProveToken')

describe('computeTokenId', function () {
  it('compute correct value', function () {
    expect(computeTokenId(fxtIssuerParameters.UIDh, fxtUProveToken))
      .to.equal('db17c922e458b4044cdc2a86295380badb6339f2f11d6a13aa561ba82f88d407')
  })
})
