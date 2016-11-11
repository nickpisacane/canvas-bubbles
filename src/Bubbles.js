import debounce from 'lodash.debounce'
import Circle from './Circle'

export default class Bubbles {
  constructor (world, options = {}) {
    this._setOptions(options)
    this.count = 0
    this.world = world
    this._handleDrawEnd = this._handleDrawEnd.bind(this)
    this._handleResize = debounce(
      this._handleResize.bind(this),
      this.options.debounce
    )
    this.setup()
  }

  setup () {
    this.count = this._getCount()
    this._populate(this.count)
    this.world.on('draw:end', this._handleDrawEnd)
    if (this.options.autosize) {
      window.addEventListener('resize', this._handleResize, false)
    }
  }

  destroy () {
    this.world.off('draw:end', this._handleDrawEnd)
    if (this.autosize) {
      window.removeEventListener('resize', this._handleResize, false)
    }
    this.world.destroy()
  }

  update (options = {}) {
    this._setOptions(options)
    this.world.once('draw:end', () => {
      this.world.bodies.forEach(circle => {
        if (options.colors) {
          this._resetCircleColor(circle)
        }
        if (options.minVelocity || options.maxVelocity) {
          this._resetCircleVelocity(circle)
        }
        if (options.minOpacityVelocity || options.maxOpacityVelocity) {
          this._resetCircleOpacityVelocity(circle)
        }
        if (options.minRadius || options.maxRadius) {
          this._resetCircleRadius(circle)
        }
      })
    })
  }

  _setOptions (options = {}) {
    this.options = Object.assign({
      density: 1,
      densityArea: 1000,
      colors: ['#fff'],
      minRadius: 1,
      maxRadius: 50,
      minVelocity: 0.1,
      maxVelocity: 1,
      minOpacityVelocity: 0.0001,
      maxOpacityVelocity: 0.001,
      initialOpacity: 0.8,
      maxDepth: 50,
      autosize: true,
      debounce: 300
    }, options)
  }

  _getCount () {
    const { width, height } = this.world
    return Math.floor((width * height / 1000) * this.options.density)
  }

  _move () {
    this.world.bodies.forEach(body => {
      body.y -= body._velocity
      body.opacity -= body._opacityVelocity
      if (body.opacity < 0 || body.y + body.radius < 0 ||
          body.x + body.radis < 0 || body.x + body.radius > this.world.width) {
        this._resetCircle(body)
      }
    })
  }

  _populate (count) {
    if (count < 0) {
      this.world.bodies.splice(this.world.bodies.length + count)
      return
    }

    for (let i = 0; i < count; i++) {
      const circle = new Circle()
      this._resetCircle(circle)
      this.world.add(circle)
    }
  }

  _resetCirclePosition (circle) {
    circle.x = randomInt(0, this.world.width)
    circle.y = randomInt(
      this.options.maxRadius + this.world.height,
      this.options.maxDepth / 100 * this.world.height + this.world.height
    )
    circle.opacity = this.options.initialOpacity
  }

  _resetCircleOpacityVelocity (circle) {
    circle._opacityVelocity = randomFloat(
      this.options.minOpacityVelocity,
      this.options.maxOpacityVelocity
    )
  }

  _resetCircleColor (circle) {
    const index = Math.floor(Math.random() * this.options.colors.length)
    circle.color = this.options.colors[index]
  }

  _resetCircleRadius (circle) {
    circle.radius = randomInt(this.options.minRadius, this.options.maxRadius)
  }

  _resetCircleVelocity (circle) {
    circle._velocity = randomFloat(
      this.options.minVelocity,
      this.options.maxVelocity
    )
  }

  _resetCircle (circle) {
    this._resetCirclePosition(circle)
    this._resetCircleColor(circle)
    this._resetCircleOpacityVelocity(circle)
    this._resetCircleRadius(circle)
    this._resetCircleVelocity(circle)
  }

  _handleDrawEnd () {
    this._move()
  }

  _handleResize () {
    const oldCount = this.count
    this.world.resize()
    const count = this.count = this._getCount()
    const dc = count - oldCount
    this._populate(dc)
  }
}

function randomFloat (min, max) {
  return min + Math.random() * (max - min)
}

function randomInt (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}
