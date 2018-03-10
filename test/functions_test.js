const {expect} = require('chai')
const {
  computeXt,
  computeX,
  computeTokenId,
  computeGamma,
  computeH,
  computeSigmaZPrime,
  computeSigmaZ,
  computeSigmaAPrime,
  computeSigmaCPrime,
  computeSigmaC,
  computeSigmaR,
  computeSigmaRPrime
} = require('../src/functions')
const fxtIssuerParameters = require('./fixtures/issuerParameters')
const {A, e, TI, x, xt, UIDt, gamma, alpha, sigmaZ, y0, PI, h, sigmaA, sigmaAPrime, sigmaBPrime, sigmaZPrime, sigmaC, sigmaR, sigmaRPrime, sigmaCPrime, beta1, beta2, w} = require('./fixtures/data')
const fxtUProveToken = require('./fixtures/uProveToken')

describe('functions should', function () {
  it('compute xt', function () {
    expect(computeXt(fxtIssuerParameters, TI).equals(xt)).to.equal(true)
  })

  it('compute x', function () {
    expect(computeX(fxtIssuerParameters.descGq.q, fxtIssuerParameters.UIDh, e[0], A[0]).equals(x[0])).to.equal(true)
    expect(computeX(fxtIssuerParameters.descGq.q, fxtIssuerParameters.UIDh, e[1], A[1]).equals(x[1])).to.equal(true)
    expect(computeX(fxtIssuerParameters.descGq.q, fxtIssuerParameters.UIDh, e[2], A[2]).equals(x[2])).to.equal(true)
    expect(computeX(fxtIssuerParameters.descGq.q, fxtIssuerParameters.UIDh, e[3], A[3]).equals(x[3])).to.equal(true)
    expect(computeX(fxtIssuerParameters.descGq.q, fxtIssuerParameters.UIDh, e[4], A[4]).equals(x[4])).to.equal(true)
  })

  it('compute token id', function () {
    expect(computeTokenId(fxtIssuerParameters.UIDh, fxtUProveToken)).to.equal(UIDt)
  })

  it('compute gamma', function () {
    expect(computeGamma(fxtIssuerParameters, x, xt).equals(gamma)).to.equal(true)
  })

  it('compute sigma z', function () {
    expect(computeSigmaZ(gamma, y0, fxtIssuerParameters.descGq.p).equals(sigmaZ)).to.equal(true)
  })

  it('compute h', function () {
    expect(computeH(gamma, alpha, fxtIssuerParameters.descGq.p).equals(h)).to.equal(true)
  })

  it('compute sigma z prime', function () {
    expect(computeSigmaZPrime(sigmaZ, alpha, fxtIssuerParameters.descGq.p).equals(sigmaZPrime)).to.equal(true)
  })

  it('compute sigma a prime', function () {
    expect(computeSigmaAPrime(t1, sigmaA).equals(sigmaAPrime)).to.equal(true)
  })

  it('compute sigma c prime', function () {
    expect(computeSigmaCPrime(fxtIssuerParameters.UIDh, h, PI, sigmaZPrime, sigmaAPrime, sigmaBPrime, fxtIssuerParameters.descGq.q).equals(sigmaCPrime)).to.equal(true)
  })

  it('compute sigma c', function () {
    expect(computeSigmaC(sigmaCPrime, beta1, fxtIssuerParameters.descGq.q).equals(sigmaC)).to.equal(true)
  })

  it('compute sigma r', function () {
    expect(computeSigmaR(sigmaC, y0, w, fxtIssuerParameters.descGq.q).equals(sigmaR)).to.equal(true)
  })

  it('compute sigma r prime', function () {
    expect(computeSigmaRPrime(sigmaR, beta2, fxtIssuerParameters.descGq.q).equals(sigmaRPrime)).to.equal(true)
  })
})
