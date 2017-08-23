const {expect} = require('chai')
const fxtIssuerParameters = require('./fixtures/issuerParameters')

describe('IssuerParameters', function () {
  it('compute hash', function () {
    expect(fxtIssuerParameters.hash).to.equal('0e67ffe8b5867c9d2724b5068f1ef5ce81a2e63d89b95cc43b69070719024a57')
  })
})
