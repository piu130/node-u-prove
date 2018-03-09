const {expect} = require('chai')
const computeXt = require('../src/computeXt')
const fxtIssuerParameters = require('./fixtures/issuerParameters')
const {TI} = require('./fixtures/data')

describe('computeXt', function () {
  it('compute correct value', function () {
    expect(computeXt(fxtIssuerParameters, TI).toString(16))
      .to.equal('721c77bf383bb3402ab49794d285a7cbcfe96e6a593baf3c96ec1cd8f4eadd8d')
  })
})
