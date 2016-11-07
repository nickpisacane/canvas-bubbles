import Circle from './Circle'

export default class Bubbles {
  constructor (world, options = {}) {
    Object.assign(this, {
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
      autosize: true
    }, options)

    this.count = 0
    this.world = world
    this._handleDrawEnd = this._handleDrawEnd.bind(this)
    this._handleResize = this._handleResize.bind(this)
    this.setup()
  }

  setup () {
    this.count = this._getCount()
    this._populate(this.count)
    this.world.on('draw:end', this._handleDrawEnd)
    if (this.autosize) {
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

  _getCount () {
    const { width, height } = this.world
    return Math.floor((width * height / 1000) * this.density)
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

  _resetCircle (circle) {
    circle.x = randomInt(0, this.world.width)
    circle.y = randomInt(
      this.maxRadius + this.world.height,
      this.maxDepth / 100 * this.world.height + this.world.height
    )
    circle.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    circle.opacity = this.initialOpacity
    circle.radius = randomInt(this.minRadius, this.maxRadius)
    circle._velocity = randomFloat(this.minVelocity, this.maxVelocity)
    circle._opacityVelocity = randomFloat(
      this.minOpacityVelocity,
      this.maxOpacityVelocity
    )
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
