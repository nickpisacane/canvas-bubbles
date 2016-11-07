import { EventEmitter } from 'events'
import RGBA from './RGBA'

export default class Body extends EventEmitter {
  constructor (options = {}) {
    super()
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
    this.emit('world', world)
    this.world = world
  }

  removeWorld () {
    this.emit('removeWorld', this.world)
    this.world = null
  }

  _shouldDraw () {
    return true
  }

  draw () {
    if (this.world) {
      if (typeof this._draw !== 'function') {
        throw new Error('Body: _draw must be implemented!')
      }
      if (this._shouldDraw()) {
        this.emit('draw:start', this.world.ctx)
        this._draw(this.world.ctx)
        this.emit('draw:end', this.world.ctx)
      }
    }
  }
}
