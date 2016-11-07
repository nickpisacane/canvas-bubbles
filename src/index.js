import World from './World'
import Bubbles from './Bubbles'

export default function bubbles (canvas, options = {}) {
  const world = new World(canvas)
  const bubbles = new Bubbles(world, options)
  world.start()
  return bubbles
}
