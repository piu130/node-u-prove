const {expect} = require('chai')
const fxtIssuerParameters = require('./fixtures/issuerParameters')
const {A, e, TI, x, xt, UIDt, gamma, alpha, alphaInverse, sigmaZ, y0, t1, t2, PI, h, sigmaA, sigmaAPrime, sigmaB, sigmaBPrime, sigmaZPrime, sigmaC, sigmaR, sigmaRPrime, sigmaCPrime, beta1, beta2, w} = require('./fixtures/data')
const fxtUProveToken = require('./fixtures/uProveToken')
const Issuer = require('../src/Issuer')
const Prover = require('../src/Prover')
const IntegerGroup = require('../src/IntegerGroup')

describe('integration test', function () {
  // Mock random number generator
  IntegerGroup.prototype.randomNumber = (includeZero = true) => y0

  const issuer = new Issuer(fxtIssuerParameters, A, TI)
  it('should construct issuer', function () {
    expect(issuer.IP).to.equal(fxtIssuerParameters)
    expect(issuer.gamma.equals(gamma)).to.equal(true)
    expect(issuer.y0.equals(y0)).to.equal(true)
    expect(issuer.sigmaZ.equals(sigmaZ)).to.equal(true)
  })

  const prover = new Prover(fxtIssuerParameters, A, TI, PI)
  it('should construct prover', function () {
    expect(prover.IP).to.equal(fxtIssuerParameters)
    expect(prover.TI).to.equal(TI)
    expect(prover.PI).to.equal(PI)
    expect(issuer.gamma.equals(gamma)).to.equal(true)
  })

  // Mock random number generator
  IntegerGroup.prototype.randomNumber = (includeZero = true) => w

  const firstMessage = issuer.generateFirstMessage()
  it('issuer should generate first message', function () {
    expect(issuer.w.equals(w)).to.equal(true)
    expect(firstMessage.sigmaZ.equals(sigmaZ)).to.equal(true)
    expect(firstMessage.sigmaA.equals(sigmaA)).to.equal(true)
    expect(firstMessage.sigmaB.equals(sigmaB)).to.equal(true)
  })

  prover.parseFirstMessage(firstMessage)
  it('prover should parse first message', function () {
    expect(prover.sigmaZ.equals(sigmaZ)).to.equal(true)
    expect(prover.sigmaA.equals(sigmaA)).to.equal(true)
    expect(prover.sigmaB.equals(sigmaB)).to.equal(true)
  })

  // Mock random number generator
  let i = 0
  IntegerGroup.prototype.randomNumber = (includeZero = true) => {
    if (i === 0) {
      i++
      return alpha
    } else if (i === 1) {
      i++
      return beta1
    } else if (i === 2) {
      i++
      return beta2
    }
  }

  const secondMessage = prover.generateSecondMessage()
  it('prover should generate second message', function () {
    expect(prover.alpha.equals(alpha)).to.equal(true)
    expect(prover.beta1.equals(beta1)).to.equal(true)
    expect(prover.beta2.equals(beta2)).to.equal(true)
    expect(prover.h.equals(h)).to.equal(true)
    expect(prover.t1.equals(t1)).to.equal(true)
    expect(prover.t2.equals(t2)).to.equal(true)
    expect(prover.alphaInverse.equals(alphaInverse)).to.equal(true)
    expect(prover.sigmaZPrime.equals(sigmaZPrime)).to.equal(true)
    expect(prover.sigmaAPrime.equals(sigmaAPrime)).to.equal(true)
    expect(prover.sigmaBPrime.equals(sigmaBPrime)).to.equal(true)
    expect(prover.sigmaCPrime.equals(sigmaCPrime)).to.equal(true)
    expect(secondMessage.sigmaC.equals(sigmaC)).to.equal(true)
  })

  issuer.parseSecondMessage(secondMessage)
  it('issuer should parse second message', function () {
    expect(issuer.sigmaC.equals(sigmaC)).to.equal(true)
  })

  const thirdMessage = issuer.generateThirdMessage()
  it('issuer should generate third message', function () {
    expect(issuer.w).to.equal(undefined)
    expect(thirdMessage.sigmaR.equals(sigmaR)).to.equal(true)
  })

  prover.parseThirdMessage(thirdMessage)
  it('prover should parse third message', function () {
    expect(prover.sigmaR.equals(sigmaR)).to.equal(true)
  })
})
