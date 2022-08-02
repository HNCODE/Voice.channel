const { BaseEvent } = require('../structures')
class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'guildMemberAdd',
      (...args) => this.run(...args)
    )
  }

  async run (member) {
    this.client.logger.info(`[Events:GuildMemberAdd] Member has entered Guild via guildId: ${member.guild.id} & memberId: ${member.id}`)
  }
}

module.exports = Event
