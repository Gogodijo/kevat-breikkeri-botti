const Discord = require('discord.js')
const speeddating = require("./commands/speeddating")
const client = new Discord.Client()
const startti = require("./commands/startti")
require('dotenv').config()
const roles = require("./commands/roles")
const moveFrom = require("./commands/moveFrom")
const info = require('./commands/info')
const roleByReaction = require('./commands/roleByReaction')
const moveChannel = require('./commands/moveChannel')

global.inProgress = false
global.previousPairs = []

client.once('ready', () => {
  console.log("Hello world!=)")
})

client.on('message', async message => {

  if (message.member.roles.cache.some(role => role.name.toLowerCase() === 'tuo hallitus')){
  if (message.content.startsWith("!") ) {
    if (message.content.split(" ")[0].toLowerCase() == "!sd") {
      speeddating.handleMessage(message)
      return
    }
    if (message.content.toLowerCase() == "!destroy voice channels") {
      speeddating.destroyChannels(message)
      return
    }
    if (message.content.split(" ")[0].toLowerCase() == "!siirrä"){
      roles.roles(message)
      return
    }
    if(message.content.toLowerCase() == "!startti") {
      startti.startti(message)
      return
    }
    if(message.content.split(" ")[0].toLowerCase() == "!siirräjostain"){
      moveFrom.move(message)
      return
    }
    if(message.content.toLowerCase() == "!info") {
      info.info(message)
      return
    }
    if(message.content.split(" ")[0].toLowerCase() == "!siirräkanava"){
      moveChannel.moveChannel(message)
      return
    }
    if(message.content.toLowerCase() == "!sitsit") {
      roleByReaction.messageAndReactions(message)
    }
  }}
  else{
  }
  return
})

client.on('rateLimit',(data) => {
  console.log(data)
})

client.login(process.env.DISCORD_CODE)