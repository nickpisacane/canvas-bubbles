let cache = window.cache = {}

const maybeHex = color => color.charAt(0) === '#'
const maybeRgb = color => color.substr(0, 3) === 'rgb'

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
    if (maybeHex(color)) {
      return this.parseHex(color)
    }
    if (maybeRgb(color)) {
      return this.parseRGB(color)
    }
    throw new Error(`Bubbles: could not parse color code: '${color}'`)
  }

  parseRGB (color) {
    if (cache[color]) return cache[color]

    const matches = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/.exec(color)
    if (matches) {
      const ret = {
        r: parseInt(matches[1], 10),
        g: parseInt(matches[2], 10),
        b: parseInt(matches[3], 10)
      }
      cache[color] = ret
      return ret
    }
    throw new Error(`Bubbles: could not parse rgb/rgba color code: '${color}'`)
  }

  parseHex (hex) {
    if (cache[hex]) return cache[hex]

    // Based off Tim Down's solution on stackoverflow
    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    const shortReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shortReg, (m, r, g, b) => r + r + g + g + b + b)

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      const ret = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
      cache[hex] = ret
      return ret
    }
    throw new Error(`Bubbles: could not parse hex color code: '${hex}'`)
  }
}

RGBA.clearCache = function () {
  cache = {}
}
