const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      'shutdown',
      ['셧다운', '노ㅕㅅ애주', 'tutekdns'],
      'BotOwner',
      ['BotOwner'],
      '<없음>',
      '봇을 종료합니다.',
      false,
      {
        voiceStatus: {
          sameChannel: false,
          inVoice: false
        },
        dmChannel: false
      }
    )
    this.dir = __filename
  }

  async run ({ message }) {
    this.client.logger.warn('[Shutdown] Shutting down...')
    await message.channel.send(`> ${this.client.utils.constructors.EMOJI_SLEEP} Shutting down...`)
    process.exit(0)
  }
}

module.exports = Command
