const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'ready',
      (...args) => this.run(...args)
    )
    this.dir = __filename
  }

  async run () {
    this.client.logger.info(`[Events:Ready] Logged as ${this.client.user.tag}(${this.client.user.id})`)
    this.client.user.setActivity({ name: '먀옹?', type: 'PLAYING' })
    this.client.initialized = true
  }
}

module.exports = Event
