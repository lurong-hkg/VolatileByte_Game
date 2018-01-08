const uuidv4 = require('uuid/v4')

const GameContext = {
  Behaviors: new Map(),
  mainloop: () => {
    this.id = Math.random() * 10000
    setInterval(() => {
      GameContext.Behaviors.forEach((v, _) => {
        v.update()
      })
    }, 200)
  }
}

class GameBehavior {
  constructor () {
    this.uuid = uuidv4()
    GameContext.Behaviors.set(this.uuid, this)
  }
}

export {
  GameContext,
  GameBehavior
}
