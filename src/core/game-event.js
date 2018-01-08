const {EventEmitter} = require('fbemitter')

const Deque = require('collections/deque')

const EventQueue = new Deque()
const EventBus = new EventEmitter()
const Events = {
  NextEvent: 'NextEvent'
}

EventBus.addListener(Events.NextEvent, () => {
  console.log('event bus next event, event Q:', EventQueue)
  if (EventQueue.length) {
    const evt = EventQueue.pop()
    if (evt.name) {
      EventBus.emit(evt.name, evt)
    } else {
      console.warn('discarding malformed event in queue', evt)
    }
  }
})

class GameEvent {
  constructor (name) {
    this.name = name
  }
}

export {
  GameEvent,
  EventBus,
  Events,
  EventQueue
}
