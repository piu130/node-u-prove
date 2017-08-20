const expect = require('chai').expect
const UProveHash = require('../src/UProveHash')
const L2048N256 = require('../src/L2048N256')

describe('UProveHash', function () {
  describe('should digest', function () {
    it('a byte', function () {
      const hash = new UProveHash('sha256')
      hash.updateByte(0x01)
      expect(hash.digest('hex')).to.equal('4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a')
    })

    it('null', function () {
      const hash = new UProveHash('sha256')
      hash.updateNull()
      expect(hash.digest('hex')).to.equal('df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119')
    })

    it('an octet string', function () {
      const hash = new UProveHash('sha256')
      hash.updateOctetString('0102030405')
      expect(hash.digest('hex')).to.equal('16df7d2d0c3882334fe0457d298a7b2413e1e5b7a880f0b5ec79eeeae7f58dd8')
    })

    it('a subgroup', function () {
      const hash = new UProveHash('sha256')
      hash.updateSubgroup(L2048N256.descGq)
      expect(hash.digest('hex')).to.equal('7b36c8a3cf1552077e1cacb365888d25c9dc54f3faed7aff9b11859aa8e4ba06')
    })

    // @todo
    // it('an ecc', function () {
    //   const hash = new UProveHash('sha256')
    //   hash.updateECC(ecc)
    //   expect(hash.digest('hex')).to.equal('02bb879cb2f89c19579105be662247db15ab45875cfc63a58745361d193ba248')
    // })

    it('a custom list', function () {
      const hash = new UProveHash('sha256')
      hash.updateUInt32(3) // length 3
      hash.updateByte(0x01)
      hash.updateOctetString('0102030405')
      hash.updateNull()
      expect(hash.digest('hex')).to.equal('dfd6a31f867566ffeb6c657af1dafb564c3de74485058426633d4b6c8bad6732')
    })

    it('a list of booleans', function () {
      const hash = new UProveHash('sha256')
      hash.updateListOfBooleans([true, false, false])
      expect(hash.digest('hex')).to.equal('401a2e9063adda8a3f68ed55b4f0b597bef0a8ff4e3ecf235f66f9a65e8d773b')
    })
  })
})
