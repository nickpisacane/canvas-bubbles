import Body from './Body'

export default class Circle extends Body {
  constructor (options = {}) {
    super(options)
    this.radius = options.radius
  }

  _shouldDraw () {
    const { x, y, radius, world: { width, height } } = this
    return x + radius > 0 && x - radius < width &&
      y + radius > 0 && y - radius < height
  }

  _draw (ctx) {
    ctx.beginPath()
    ctx.fillStyle = this.rgba.toString()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
    ctx.fill()
    ctx.closePath()
  }
}
