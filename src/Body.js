import RGBA from './RGBA'

export default class Body {
  constructor (options = {}) {
    this.x = options.x
    this.y = options.y
    this._color = options.color || '#ffffff'
    this._opacity = options.opacity || 1
    this.world = null
    this.rgba = new RGBA(this._color, this._opacity)

    Object.defineProperties(this, {
      color: {
        get: () => this._color,
        set: color => {
          this.rgba.setColor(color)
          this._color = color
        },
        enumerable: true
      },
      opacity: {
        get: () => this._opacity,
        set: opacity => {
          this.rgba.opacity = opacity
          this._opacity = opacity
        },
        enumerable: true
      }
    })
  }

  setWorld (world) {
    this.world = world
  }

  removeWorld () {
    this.world = null
  }

  _shouldDraw () {
    return true
  }

  draw () {
    if (this.world && this._shouldDraw()) {
      this._draw(this.world.ctx)
    }
  }
}
