import debounce from 'lodash.debounce'
import Bubble from './Bubble'
import RGBA from './RGBA'

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
    RGBA.clearCache()
  }

  update (options = {}) {
    this.options = Object.assign({}, this.options, options)
    this.world.once('draw:end', () => {
      this.world.bodies.forEach(bubble => {
        if (options.colors) {
          this._resetBubbleColor(bubble)
        }
        if (options.minVelocity || options.maxVelocity) {
          this._resetBubbleVelocity(bubble)
        }
        if (options.minOpacityVelocity || options.maxOpacityVelocity) {
          this._resetBubbleOpacityVelocity(bubble)
        }
        if (options.minRadius || options.maxRadius) {
          this._resetBubbleRadius(bubble)
        }
        if (options.density) {
          const oldCount = this.count
          this.count = this._getCount()
          this._populate(this.count - oldCount)
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
      maxRadius: 25,
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
    this.world.bodies.forEach(bubble => {
      bubble.y -= bubble.velocity
      bubble.opacity -= bubble.opacityVelocity
      if (bubble.opacity < 0 || bubble.y + bubble.radius < 0 ||
          bubble.x + bubble.radis < 0 || bubble.x + bubble.radius > this.world.width) {
        this._resetBubble(bubble)
      }
    })
  }

  _populate (count) {
    if (count < 0) {
      this.world.bodies.splice(this.world.bodies.length + count)
      return
    }

    for (let i = 0; i < count; i++) {
      const bubble = new Bubble()
      this._resetBubble(bubble)
      this.world.add(bubble)
    }
  }

  _resetBubblePosition (bubble) {
    bubble.x = randomInt(0, this.world.width)
    bubble.y = randomInt(
      this.options.maxRadius + this.world.height,
      this.options.maxDepth / 100 * this.world.height + this.world.height
    )
    bubble.opacity = this.options.initialOpacity
  }

  _resetBubbleOpacityVelocity (bubble) {
    bubble.opacityVelocity = randomFloat(
      this.options.minOpacityVelocity,
      this.options.maxOpacityVelocity
    )
  }

  _resetBubbleColor (bubble) {
    const index = Math.floor(Math.random() * this.options.colors.length)
    bubble.color = this.options.colors[index]
  }

  _resetBubbleRadius (bubble) {
    bubble.radius = randomInt(this.options.minRadius, this.options.maxRadius)
  }

  _resetBubbleVelocity (bubble) {
    bubble.velocity = randomFloat(
      this.options.minVelocity,
      this.options.maxVelocity
    )
  }

  _resetBubble (bubble) {
    this._resetBubblePosition(bubble)
    this._resetBubbleColor(bubble)
    this._resetBubbleOpacityVelocity(bubble)
    this._resetBubbleRadius(bubble)
    this._resetBubbleVelocity(bubble)
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
