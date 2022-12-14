const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'message',
      (...args) => this.run(...args)
    )
    this.classPrefix = '[Events:Message'
    this.defaultPrefix = {
      commandHandler: `${this.classPrefix}:CommandHandler]`,
      messageHandler: `${this.classPrefix}:MessageHandler]`
    }
    this.dir = __filename
  }

  async run (message) {
    this.commandHandler(message)
    this.messageHandler(message)
  }

  async messageHandler (message) {
    if (!message.guild || message.author.bot || message.system || message.channel.type === 'dm') return
    await this.client.database.getUser(message.author.id)
    await this.client.database.getMember(message.author.id, message.guild.id)
  }

  async commandHandler (message) {
    if (message.author.bot || message.system) return
    const { prefix } = this.client._options.bot
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const Command = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command))
    if (message.content.startsWith(prefix) && Command) {
      if (!Command.requirements.dmChannel && message.channel.type === 'dm') return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} Commands are not available on **DM** Channel!`)
      const getGuild = await this.client.database.getGuild(message.guild.id)
      const getUser = await this.client.database.getUser(message.author.id)
      const getMember = await this.client.database.getMember(message.author.id, message.guild.id)
      if (getGuild.tch && getGuild.tch !== '0') {
        const getChannel = message.guild.channels.cache.get(getGuild.tch)
        if (getChannel && getGuild.tch !== message.channel.id && (!this.client._options.bot.owners.includes(message.author.id) || !message.member.permissions.has('ADMINISTRATOR'))) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ?????? ???????????? **${getChannel}** ?????? ????????? ??? ????????????!`)
      }
      if (this.client.debug && !this.client._options.bot.owners.includes(message.author.id)) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ?????? ?????? ???????????? ???????????????. ????????? ?????? ??????????????????.`)
      if (this.client.isReload && !this.client._options.bot.owners.includes(message.author.id)) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ?????? ?????? ???????????? ????????? ????????????. ?????? ??? ??????????????????.`)
      if (Command.requirements.voiceStatus.inVoice && !message.member.voice.channel) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ?????? ?????? ????????? ?????? ???, ???????????? ??????????????????!`)
      if (getUser.ban && !this.client._options.bot.owners.includes(message.author.id)) {
        this.client.logger.warn(`${this.defaultPrefix.commandHandler} This user has been banned (${message.author.id})`)
        return message.delete()
      }
      let count = 0
      const permissions = this.client.permissionChecker.chkPerms(message.member)
      for (const perm of permissions) {
        if (Command.permissions.includes(perm)) {
          count++
          this.client.logger.debug(`${this.defaultPrefix.commandHandler} Execute Command to guild via guildId: ${message.guild.id} & TextChannelId: ${message.channel.id} & memberId: ${message.author.id}`)
          try {
            await Command.run({ message, args, data: { prefix, getGuild, getMember, getUser, permissions } })
          } catch (error) {
            this.client.logger.error(`${this.defaultPrefix.commandHandler} Executing Command an error occurred to ${Command.name}!\nErrorName: ${error.name}, GuildId: ${message.guild.id}, TchId: ${message.channel.id}, MessageId: ${message.id}, AuthorId: ${message.author.id}\n${error.stack}`)
            const getUUID = await this.client.database.addErrorInfo('COMMAND_ERROR', error, message, command.name, args)
            message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ??????, ??? ??? ?????? ????????? ???????????? ??????????????? ????????????! ?????? ????????? ??????????????? ??????????????????!\n\`?????? ??????: ${getUUID}\``)
            this.client.logger.warn(`${this.defaultPrefix.commandHandler} Created UUID Code: ${getUUID}`)
          }
        }
      }
      if (count === 0) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ?????? ???????????? ??????????????? ?????? ????????? ???????????????! \`${Command.permissions.join('`, `')}\``)
    }
  }
}

module.exports = Event
