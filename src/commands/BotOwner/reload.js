const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      'reload',
      ['리로드', 'ㄹㄹㄷ', 'flfhem', 'ㄱ디ㅐㅁㅇ', 'ffe'],
      'BotOwner',
      ['BotOwner'],
      '<없음>',
      '봇의 필요한 구성 요소들을 리로드합니다.',
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
    const msg = await message.channel.send(`> ${this.client.utils.constructors.EMOJI_SANDCLOCK} Reloading Client...`)
    try {
      await this.client.reload()
      await msg.edit(`> ${this.client.utils.constructors.EMOJI_YES} Reloaded at Client!`)
    } catch (e) {
      this.client.logger.error(`[Client:Reload] Reloading at Client an error occurred!\n${e.stack}`)
      await msg.edit(`> ${this.client.utils.constructors.EMOJI_WARN} Reloading at Client an error occurred! \`${e.name}\``)
      if (this.client.debug) await message.channel.send(e.stack, { code: 'js' })
    }
  }
}

module.exports = Command
