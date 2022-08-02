const { VoiceChannel } = require('discord.js')
const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'voiceStateUpdate',
      (...args) => this.run(...args)
    )
    this.dir = __filename
  }

  async run (oldState, newState) {
    if (oldState) {
      const guildData = await this.client.database.getGuild(oldState.guild.id)
      const getTemporary = this.client.temporary.get(`${oldState.channelID}-${oldState.guild.id}`)
      if (guildData.vch !== '0' && guildData.category1 !== '0' && guildData.category2 !== '0' && oldState.guild.id === getTemporary?.guildId && getTemporary) {
        const getGuild = this.client.guilds.cache.get(oldState.guild.id)
        const getVC = getGuild.channels.cache.get(oldState.channelID)
        const getTC = getGuild.channels.cache.get(getTemporary.tchId)
        if (getVC.members.size !== 0) {
          try { await getTC.createOverwrite(newState.id, { VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false }) } catch {}
        } else {
          this.client.logger.debug(`[Event:VoiceStateUpdate] ${oldState.id} left a temporary voice channel, remove channel...`)
          this.client.logger.debug(`[Event:VoiceStateUpdate] Temporary Channels Removed to ${oldState.id}, VCH: ${getTemporary.vchId} & TCH: ${getTemporary.tchID}`)
          const vch = getGuild.channels.cache.get(getTemporary.vchId)
          const tch = getGuild.channels.cache.get(getTemporary.tchId)
          try { await vch.delete() } catch {}
          try { await tch.delete() } catch {}
          this.client.temporary.delete(`${oldState.channelID}-${oldState.guild.id}`)
        }
      }
    }
    if (newState) {
      const guildData = await this.client.database.getGuild(newState.guild.id)
      const getTemporary = this.client.temporary.get(`${newState.channelID}-${newState.guild.id}`)
      const getGuild = this.client.guilds.cache.get(newState.guild.id)
      if (getTemporary) {
        const getGuild = this.client.guilds.cache.get(newState.guild.id)
        const getTC = getGuild.channels.cache.get(getTemporary.tchId)
        try { await getTC.createOverwrite(newState.id, { VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true, SEND_MESSAGES: true }) } catch {}
      }
      if (guildData.vch !== '0' && guildData.category1 !== '0' && guildData.category2 !== '0' && newState.channel?.parentID === guildData.category1 && !getTemporary) {
        const { permissionOverwrites, bitrate, userLimit } = getGuild.channels.cache.get(newState.channelID) // permissionOverwrites, bitrate, userLimit
        const getMember = this.client.guilds.cache.get(newState.guild.id).members.cache.get(newState.id)
        this.client.logger.debug(`[Event:VoiceStateUpdate] ${newState.id} entered a temporary voice channel, create channel...`)
        const channelname = getGuild.channels.cache.get(newState.channelID).name
        var newVC
        var newTC
        if(channelname.toLowerCase().includes("배그")||channelname.toLowerCase().includes("배틀그라운드")||channelname.toLowerCase().includes("PUBG")||channelname.toLowerCase().includes("서든")||channelname.toLowerCase().includes("SUDDEN")||channelname.toLowerCase().includes("롤")||channelname.toLowerCase().includes("리그")||channelname.toLowerCase().includes("lol")||channelname.toLowerCase().includes("leag")){////////
           newVC = await newState.guild.channels.create(`${channelname}`, {
            type: 'voice',
            parent: guildData.category2,
            permissionOverwrites: [
              {
                id: newState.guild.id,
                allow: permissionOverwrites.get(newState.guild.id) ? permissionOverwrites.get(newState.guild.id)?.allow?.bitfield : []
              },
              {
                id: getMember.user.id,
                allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'MANAGE_CHANNELS']
              }
            ],
            bitrate,
            userLimit
          })
          newTC = await newState.guild.channels.create(`${channelname}`, {
            type: 'text',
            parent: guildData.category2,
            permissionOverwrites: [
              { id: newState.guild.id, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS'] },
              { id: getMember.user.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS'] }
            ]
          })
          newTC.send(`방 개설자: ${getMember.user.tag}`)
        }else{//////////
        newVC = await newState.guild.channels.create(`${getMember.user.tag}`, {
          type: 'voice',
          parent: guildData.category2,
          permissionOverwrites: [
            {
              id: newState.guild.id,
              allow: permissionOverwrites.get(newState.guild.id) ? permissionOverwrites.get(newState.guild.id)?.allow?.bitfield : []
            },
            {
              id: getMember.user.id,
              allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'MANAGE_CHANNELS']
            }
          ],
          bitrate,
          userLimit
        })
        newTC = await newState.guild.channels.create(`${getMember.user.tag}`, {
          type: 'text',
          parent: guildData.category2,
          permissionOverwrites: [
            { id: newState.guild.id, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS'] },
            { id: getMember.user.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS'] }
          ]
        })
        newTC.send(`방 개설자: ${getMember.user.tag}`)
      }///////////
        this.client.logger.debug(`[Event:VoiceStateUpdate] Temporary Channels Saved to ${getMember.user.id}, VCH: ${newVC.id} & TCH: ${newTC.id}`)
        try { await getMember.voice.setChannel(newVC) } catch {}
        this.client.temporary.set(`${newState.channelID}-${newState.guild.id}`, { vchId: newVC.id, tchId: newTC.id, guildId: newState.guild.id, userId: newState.id, locked: false })
      }
    }
  }
}

module.exports = Event
