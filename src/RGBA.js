export default class RGBA {
  constructor (color, opacity) {
    this.setColor(color)
    this.opacity = opacity
  }

  setColor (color) {
    Object.assign(this, this.parseColor(color))
  }

  toString () {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`
  }

  parseColor (color) {
    if (/^#/.test(color)) {
      return this.parseHex(color)
    } else {
      return this.parseRGB(color)
    }
  }

  parseRGB (color) {
    // TODO
  }

  parseHex (hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shortReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shortReg, (m, r, g, b) => r + r + g + g + b + b)

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {
      r: 255,
      g: 255,
      b: 255
    }
  }
}
