const {expect} = require('chai')
const {
  computeXt,
  computeX,
  computeTokenId,
  computeGamma,
  computeH,
  computeSigmaZPrime,
  computeT1,
  computeT2,
  computeAlphaInverse,
  computeSigmaZ,
  computeSigmaBPrime,
  computeSigmaAPrime,
  computeSigmaCPrime,
  computeSigmaA,
  computeSigmaB,
  computeSigmaC,
  computeSigmaR,
  computeSigmaRPrime,
  verifyTokenSignature,
  verifySigmaABPrime,
  computeVerifiablyRandomElementSubgroup
} = require('../src/functions')
const fxtIssuerParameters = require('./fixtures/issuerParameters')
const {A, e, TI, x, xt, UIDt, gamma, alpha, alphaInverse, sigmaZ, y0, t1, t2, PI, h, sigmaA, sigmaAPrime, sigmaB, sigmaBPrime, sigmaZPrime, sigmaC, sigmaR, sigmaRPrime, sigmaCPrime, beta1, beta2, w} = require('./fixtures/data')
const fxtUProveToken = require('./fixtures/uProveToken')
const {domainParamSeed} = require('../src/L2048N256')

describe('functions should', function () {
  it('compute xt', function () {
    expect(computeXt(fxtIssuerParameters, TI).equals(xt)).to.equal(true)
  })

  it('compute x', function () {
    expect(computeX(fxtIssuerParameters, e[0], A[0]).equals(x[0])).to.equal(true)
    expect(computeX(fxtIssuerParameters, e[1], A[1]).equals(x[1])).to.equal(true)
    expect(computeX(fxtIssuerParameters, e[2], A[2]).equals(x[2])).to.equal(true)
    expect(computeX(fxtIssuerParameters, e[3], A[3]).equals(x[3])).to.equal(true)
    expect(computeX(fxtIssuerParameters, e[4], A[4]).equals(x[4])).to.equal(true)
  })

  it('compute token id', function () {
    expect(computeTokenId(fxtIssuerParameters, fxtUProveToken)).to.equal(UIDt)
  })

  it('compute gamma', function () {
    expect(computeGamma(fxtIssuerParameters, x, xt).equals(gamma)).to.equal(true)
  })

  it('compute sigma z', function () {
    expect(computeSigmaZ(fxtIssuerParameters, gamma, y0).equals(sigmaZ)).to.equal(true)
  })

  it('compute h', function () {
    expect(computeH(fxtIssuerParameters, gamma, alpha).equals(h)).to.equal(true)
  })

  it('compute sigma z prime', function () {
    expect(computeSigmaZPrime(fxtIssuerParameters, sigmaZ, alpha).equals(sigmaZPrime)).to.equal(true)
  })

  it('compute t1', function () {
    expect(computeT1(fxtIssuerParameters, beta1, beta2).equals(t1)).to.equal(true)
  })

  it('compute t2', function () {
    expect(computeT2(fxtIssuerParameters, h, beta2).equals(t2)).to.equal(true)
  })

  it('compute alpha inverse', function () {
    expect(computeAlphaInverse(fxtIssuerParameters, alpha).equals(alphaInverse)).to.equal(true)
  })

  it('compute sigma a prime', function () {
    expect(computeSigmaAPrime(fxtIssuerParameters, t1, sigmaA).equals(sigmaAPrime)).to.equal(true)
  })

  it('compute sigma b prime', function () {
    expect(computeSigmaBPrime(fxtIssuerParameters, sigmaZPrime, beta1, t2, sigmaB, alpha).equals(sigmaBPrime)).to.equal(true)
  })

  it('compute sigma c prime', function () {
    expect(computeSigmaCPrime(fxtIssuerParameters, h, PI, sigmaZPrime, sigmaAPrime, sigmaBPrime).equals(sigmaCPrime)).to.equal(true)
  })

  it('compute sigma a', function () {
    expect(computeSigmaA(fxtIssuerParameters, w).equals(sigmaA)).to.equal(true)
  })

  it('compute sigma b', function () {
    expect(computeSigmaB(fxtIssuerParameters, gamma, w).equals(sigmaB)).to.equal(true)
  })

  it('compute sigma c', function () {
    expect(computeSigmaC(fxtIssuerParameters, sigmaCPrime, beta1).equals(sigmaC)).to.equal(true)
  })

  it('compute sigma r', function () {
    expect(computeSigmaR(fxtIssuerParameters, sigmaC, y0, w).equals(sigmaR)).to.equal(true)
  })

  it('compute sigma r prime', function () {
    expect(computeSigmaRPrime(fxtIssuerParameters, sigmaR, beta2).equals(sigmaRPrime)).to.equal(true)
  })

  it('verify token signature', function () {
    expect(verifyTokenSignature(fxtIssuerParameters, fxtUProveToken)).to.equal(true)
  })

  it('verify sigma a b prime', function () {
    expect(verifySigmaABPrime(fxtIssuerParameters, sigmaAPrime, sigmaBPrime, h, sigmaRPrime, sigmaZPrime, sigmaCPrime)).to.equal(true)
  })

  it('compute verifiably random element', function () {
    expect(computeVerifiablyRandomElementSubgroup(fxtIssuerParameters, domainParamSeed, 1).equals(fxtIssuerParameters.generators[1])).to.equal(true)
    expect(computeVerifiablyRandomElementSubgroup(fxtIssuerParameters, domainParamSeed, 2).equals(fxtIssuerParameters.generators[2])).to.equal(true)
  })
})
