import Circle from './Circle'

export default class Bubbles {
  constructor (world, options = {}) {
    this.density = options.density || 1
    this.colors = options.colors
    this.rmin = options.rmin || 1
    this.rmax = options.rmax || 50
    this.vmin = options.vmin || 0.1
    this.vmax = options.vmax || 1
    this.omin = options.omin || 0.0001
    this.omax = options.omax || 0.001

    this.world = world
    this.world.start()
    this.populate()

    setInterval(() => {
      this.world.once('draw:end', () => {
        this.populate()
      })
    }, 5000)

    this.world.on('draw:end', () => {
      this.move()
    })
  }

  move () {
    this.world.bodies.forEach(body => {
      body.y -= body._velocity
      body.opacity -= body._opacityDelta
      if (body.opacity < 0 || body.y + body.radius * 2 < 0) {
        this.world.remove(body)
      }
    })
  }

  populate () {
    const count = this.density * (this.world.width / 100)

    for (let i = 0; i < count; i++) {
      const circle = new Circle({
        x: randomInt(0, this.world.width),
        y: randomInt(200 + this.world.height, this.rmax + this.world.height),
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        opacity: 0.8,
        radius: randomInt(this.rmin, this.rmax)
      })
      circle._velocity = randomFloat(this.vmin, this.vmax)
      circle._opacityDelta = randomFloat(this.omin, this.omax)
      this.world.add(circle)
    }
  }
}

function randomFloat (min, max) {
  return min + Math.random() * (max - min)
}

function randomInt (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}
