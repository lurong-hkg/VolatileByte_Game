import { GameEvent } from './game-event'
const Promise = require('bluebird')
const eventName = 'NewDialogueEvent'

class NewDialogueEvent extends GameEvent {
  constructor (dialogue) {
    super(eventName)
    this.dialogue = dialogue
  }
}
NewDialogueEvent.evtName = eventName

class Dialogue {
  constructor (opt) {
    this.content = opt.content
    this.options = opt.options
    this.image = opt.image
  }

  hasOptions () {
    return this.options && this.options.length() > 0
  }
}

class Option {
  constructor (context) {
    this.context = context
    this.content = context.content
    this.customScript = context.customScript
    this._createPromises()
  }

  refresh () {
    this._createPromises()
  }

  _createPromises () {
    this._internalPromise = Promise.bind(this).then(() => new Promise((resolve, reject) => {
      this.resolve = resolve.bind(this)
      this.reject = reject.bind(this)
    }))

    this.optionPromise = this._internalPromise.then(() => {
      return this.onResolve()
    }).catch((e) => {
      console.error(e)
      return this.onReject()
    })
  }

  /* eslint no-unused-vars: "off" */
  onResolve () {
    if (this.customScript && this.customScript.onResolve) {
      const context = this.context
      eval(this.customScript.onResolve)
    } else {
      console.warn('no custom script on resolve')
    }
    if (this.subDialogues.afterResolve) {
      this.context.EventQueue.push(new NewDialogueEvent(this.subDialogues.afterResolve))
    }
  }

  onReject () {
    if (this.customScript && this.customScript.onReject) {
      const context = this.context
      eval(this.customScript.onReject)
    } else {
      console.warn('no custom script on resolve')
    }
    if (this.subDialogues.afterResolve) {
      this.context.EventQueue.push(new NewDialogueEvent(this.subDialogues.afterResolve))
    }
  }
}

export {
  Dialogue,
  NewDialogueEvent,
  Option
}
