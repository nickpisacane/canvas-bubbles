import { EventEmitter } from 'events'
import { polyfill } from 'raf'

polyfill()

export default class World extends EventEmitter {
  constructor (canvas, options = {}) {
    super()
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.bodies = []
    this.draw = this.draw.bind(this)
    this._loop = this._loop.bind(this)
    this.active = false
    this._id = null
    this.resize()

    Object.defineProperties(this, {
      width: {
        get: () => this.canvas.width,
        enumerable: true
      },
      height: {
        get: () => this.canvas.height,
        enumerable: true
      }
    })
  }

  _loop () {
    if (this.active) {
      this.draw()
      this._id = window.requestAnimationFrame(this._loop)
    }
  }

  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  destroy () {
    this.stop()
    this.clear()
    this.bodies = []
  }

  draw () {
    this.emit('draw:start')
    this.clear()
    this.bodies.forEach(body => body.draw())
    this.emit('draw:end')
  }

  add (body) {
    body.setWorld(this)
    this.bodies.push(body)
  }

  remove (body) {
    const index = this.bodies.indexOf(body)
    if (~index) {
      const body = this.bodies[index]
      this.bodies.splice(index, 1)
      body.removeWorld()
    }
  }

  start () {
    this.active = true
    this._id = window.requestAnimationFrame(this._loop)
  }

  stop () {
    this.active = false
    window.cancelAnimationFram(this._id)
  }

  resize () {
    const { width, height } = this.canvas.parentElement.getBoundingClientRect()
    this.canvas.width = width
    this.canvas.height = height
  }
}
