const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'guildMemberRemove',
      (...args) => this.run(...args)
    )
  }

  async run (member) {
    this.client.logger.info(`[Events:GuildMemberRemove] Member has left Guild via guildId: ${member.guild.id} & memberId: ${member.id}`)
  }
}

module.exports = Event
