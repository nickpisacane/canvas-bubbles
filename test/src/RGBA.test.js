import { expect } from 'chai'
import RGBA from '../../src/RGBA'

describe('RGBA', function () {
  it('should parse hex color codes (long form)', () => {
    const rgba = new RGBA('#A4B4C4')
    expect(rgba.r).to.equal(164)
    expect(rgba.g).to.equal(180)
    expect(rgba.b).to.equal(196)
  })

  it('should parse hex color codes (short form)', () => {
    const rgba = new RGBA('#abc')
    expect(rgba.r).to.equal(170)
    expect(rgba.g).to.equal(187)
    expect(rgba.b).to.equal(204)
  })

  it('should parse rgb color codes', () => {
    const rgba = new RGBA('rgb(42, 42, 42)')
    expect(rgba.r).to.equal(42)
    expect(rgba.g).to.equal(42)
    expect(rgba.b).to.equal(42)
  })

  it('should parse rgba color codes', () => {
    const rgba = new RGBA('rgba(42, 42, 42, 0.8)')
    expect(rgba.r).to.equal(42)
    expect(rgba.g).to.equal(42)
    expect(rgba.b).to.equal(42)
  })

  it('should update via setColor', () => {
    const rgba = new RGBA('#A4B4C4')
    expect(rgba.r).to.equal(164)
    expect(rgba.g).to.equal(180)
    expect(rgba.b).to.equal(196)
    rgba.setColor('rgba(42, 42, 42, 0.8)')
    expect(rgba.r).to.equal(42)
    expect(rgba.g).to.equal(42)
    expect(rgba.b).to.equal(42)
  })

  it('throws an error when given funky input', () => {
    expect(() => new RGBA('foo')).throw(Error)
    expect(() => new RGBA('#badhex')).throw(Error)
    expect(() => new RGBA('rgba(not, rea, lly)')).throw(Error)
  })
})
