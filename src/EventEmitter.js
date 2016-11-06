export default class EventEmitter {
  constructor () {
    this._events = {}
  }

  on (event, handler) {
    this._events[event] = this._events[event] || []
    this._events[event].push(handler)
  }

  off (event, handler) {
    const index = (this._events[event] || []).indexOf(handler)
    if (~index) {
      this._events[event].splice(index, 1)
    }

    if (typeof handler === 'boolean' && handler && event in this._events) {
      this._events[event] = []
    }
  }

  once (event, handler) {
    const wrapper = function () {
      handler.apply(null, arguments)
      this.off(event, wrapper)
    }.bind(this)

    return this.on(event, wrapper)
  }

  emit (event) {
    const args = [].slice.call(arguments, 1)
    const handlers = this._events[event] || []
    handlers.forEach(handler => handler.apply(null, args))
  }
}
