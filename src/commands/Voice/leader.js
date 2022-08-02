const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      'leader',
      ['리더'],
      'Voice',
      ['Everyone'],
      '<멤버>',
      '해당 멤버에게 자신의 음성채널 권한을 양도합니다.',
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

  async run ({ message, args }) {
    const opts = args[0]
    if (!opts) return message.channel.send(this.argumentNotProvided())
    const getTemporary = this.client.temporary.filter(el => el.userId === message.author.id)
    if (getTemporary.size === 0) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 당신이 생성한 임시 채널을 찾을 수 없습니다!`)
    if (getTemporary.size > 1) return message.channels.send(`> ${this.client.utils.constructors.EMOJI_NO} 알 수 없는 오류!`)
    const getMember = message.guild.members.cache.get(message.mentions.members.first() ? message.mentions.members.first().id : this.mentionId(opts))
    if (!getMember) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 해당 멤버를 찾을 수 없습니다!`)
    if (getMember.id === message.author.id) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 자신에겐 양도할 수 없습니다!`)
    if (getMember.user.bot) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 봇에겐 양도할 수 없습니다!`)
    const vch = message.guild.channels.cache.get(getTemporary.first().vchId)
    const tch = message.guild.channels.cache.get(getTemporary.first().tchId)
    try { await vch.createOverwrite(message.author.id, { VIEW_CHANNEL: true, CONNECT: true, SPEAK: true, MANAGE_CHANNELS: false }) } catch {}
    try { await vch.createOverwrite(getMember.user.id, { VIEW_CHANNEL: true, CONNECT: true, SPEAK: true, MANAGE_CHANNELS: true }) } catch {}
    if (message.member.voice?.channel?.id !== getTemporary.first().tchId) try { await tch.createOverwrite(message.author.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false, READ_MESSAGE_HISTORY: false, MANAGE_CHANNELS: false }) } catch {}
    else try { await tch.createOverwrite(message.author.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, MANAGE_CHANNELS: false }) } catch {}
    try { await tch.createOverwrite(getMember.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, MANAGE_CHANNELS: true }) } catch {}
    getTemporary.first().userId = getMember.user.id
    await message.channel.send(`> ${this.client.utils.constructors.EMOJI_YES} 리더가 ${message.author} 님에서 ${getMember} 님으로 변경되었습니다!`)
  }
}

module.exports = Command
