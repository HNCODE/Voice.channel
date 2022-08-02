const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      'setup',
      [],
      'Voice',
      ['Administrator'],
      '<없음>',
      '임시 음성채널의 초기 설정을 합니다.',
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

  async run ({ message, data: { getGuild } }) {
    if (getGuild.vch !== '0' && getGuild.category1 !== '0' && getGuild.category2 !== '0') return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} Alreay temporary!`)
    const msg = await message.channel.send(`> ${this.client.utils.constructors.EMOJI_HAMMER} Setup to temporary...`)
    const firstCategory = await message.guild.channels.create('🚪방/방만들기', { type: 'category', reason: 'temporary voice channel to category 1' })
    const SecondCategory = await message.guild.channels.create('🚪방/List', { type: 'category', reason: 'temporary voice channel to category 2' })
    const firstInVoiceChannel = await message.guild.channels.create('🚪방만들기(∞명)', { type: 'voice', reason: 'temporary voice channel was created.', permissionOverwrites: [{ id: message.guild.id, deny: ['SPEAK'], allow: ['VIEW_CHANNEL'] }], parent: firstCategory.id })
    await this.client.database.updateGuild(message.guild.id, { $set: { category1: firstCategory.id } })
    await this.client.database.updateGuild(message.guild.id, { $set: { category2: SecondCategory.id } })
    await this.client.database.updateGuild(message.guild.id, { $set: { vch: firstInVoiceChannel.id } })
    await msg.edit(`> ${this.client.utils.constructors.EMOJI_HAMMER} Setup to temporary has success!\n\`Category 1\`: ${firstCategory.id}\n\`Category 2\`: ${SecondCategory.id}\n\`Category 1 in VoiceChannel\`: ${firstInVoiceChannel.id}`)
  }
}

module.exports = Command
