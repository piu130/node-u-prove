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
  verifyTokenSignature
} = require('../src/functions')
const fxtIssuerParameters = require('./fixtures/issuerParameters')
const {A, e, TI, x, xt, UIDt, gamma, alpha, alphaInverse, sigmaZ, y0, t1, t2, PI, h, sigmaA, sigmaAPrime, sigmaB, sigmaBPrime, sigmaZPrime, sigmaC, sigmaR, sigmaRPrime, sigmaCPrime, beta1, beta2, w} = require('./fixtures/data')
const fxtUProveToken = require('./fixtures/uProveToken')

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
    expect(computeTokenId(fxtIssuerParameters.UIDh, fxtUProveToken)).to.equal(UIDt)
  })

  it('compute gamma', function () {
    expect(computeGamma(fxtIssuerParameters, x, xt).equals(gamma)).to.equal(true)
  })

  it('compute sigma z', function () {
    expect(computeSigmaZ(fxtIssuerParameters.descGq, gamma, y0).equals(sigmaZ)).to.equal(true)
  })

  it('compute h', function () {
    expect(computeH(gamma, alpha, fxtIssuerParameters.descGq).equals(h)).to.equal(true)
  })

  it('compute sigma z prime', function () {
    expect(computeSigmaZPrime(sigmaZ, alpha, fxtIssuerParameters.descGq).equals(sigmaZPrime)).to.equal(true)
  })

  it('compute t1', function () {
    expect(computeT1(fxtIssuerParameters.generators[0], fxtIssuerParameters.descGq.g, beta1, beta2, fxtIssuerParameters.descGq).equals(t1)).to.equal(true)
  })

  it('compute t2', function () {
    expect(computeT2(h, beta2, fxtIssuerParameters.descGq).equals(t2)).to.equal(true)
  })

  it('compute alpha inverse', function () {
    expect(computeAlphaInverse(alpha, fxtIssuerParameters.descGq).equals(alphaInverse)).to.equal(true)
  })

  it('compute sigma a prime', function () {
    expect(computeSigmaAPrime(t1, sigmaA, fxtIssuerParameters.descGq).equals(sigmaAPrime)).to.equal(true)
  })

  it('compute sigma b prime', function () {
    expect(computeSigmaBPrime(sigmaZPrime, beta1, t2, sigmaB, alpha, fxtIssuerParameters.descGq).equals(sigmaBPrime)).to.equal(true)
  })

  it('compute sigma c prime', function () {
    expect(computeSigmaCPrime(fxtIssuerParameters.UIDh, h, PI, sigmaZPrime, sigmaAPrime, sigmaBPrime, fxtIssuerParameters.descGq).equals(sigmaCPrime)).to.equal(true)
  })

  it('compute sigma a', function () {
    expect(computeSigmaA(fxtIssuerParameters.descGq, w).equals(sigmaA)).to.equal(true)
  })

  it('compute sigma b', function () {
    expect(computeSigmaB(fxtIssuerParameters.descGq, gamma, w).equals(sigmaB)).to.equal(true)
  })

  it('compute sigma c', function () {
    expect(computeSigmaC(sigmaCPrime, beta1, fxtIssuerParameters.descGq).equals(sigmaC)).to.equal(true)
  })

  it('compute sigma r', function () {
    expect(computeSigmaR(sigmaC, y0, w, fxtIssuerParameters.descGq).equals(sigmaR)).to.equal(true)
  })

  it('compute sigma r prime', function () {
    expect(computeSigmaRPrime(sigmaR, beta2, fxtIssuerParameters.descGq).equals(sigmaRPrime)).to.equal(true)
  })

  it('verify token signature', function () {
    expect(verifyTokenSignature(fxtIssuerParameters, fxtUProveToken)).to.equal(true)
  })
})
