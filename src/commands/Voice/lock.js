const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      'lock',
      ['잠금'],
      'Voice',
      ['Everyone'],
      '<없음>',
      '임시 음성채널을 잠구거나 풉니다.',
      false,
      {
        voiceStatus: {
          sameChannel: false,
          inVoice: false
        },
        dmChannel: false
      }
    )
  }

  async run ({ message }) {
    const getTemporary = this.client.temporary.filter(el => el.userId === message.author.id)
    if (getTemporary.size === 0) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 당신이 생성한 임시 채널을 찾을 수 없습니다!`)
    const isLocked = !getTemporary.first().locked
    getTemporary.first().locked = isLocked
    try { await message.guild.channels.cache.get(getTemporary.first().vchId).createOverwrite(message.guild.id, { VIEW_CHANNEL: !isLocked, CONNECT: !isLocked, SPEAK: !isLocked, MANAGE_CHANNELS: false }) } catch {}
    await message.channel.send(`> ${this.client.utils.constructors.EMOJI_YES} ${message.author} 님의 임시 음성채널${isLocked ? '을 잠궜습니다' : '의 잠금을 풀었습니다'}!`)
  }
}

module.exports = Command
